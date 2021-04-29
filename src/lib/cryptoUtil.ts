import * as CryptoJS from "crypto-js";
// import { createHmac } from "crypto";
/**
 * Construct crypto functions needed dependig on env (Browser vs Nodde)
 * */
export const crypto = () => {
  let hmacSHA256Hex: Function;
  if (typeof window !== "undefined" && window.crypto) {
    const hexString = (buffer: ArrayBuffer) => {
      const byteArray = new Uint8Array(buffer);
      const hexCodes = [...byteArray].map((value) => {
        const hexCode = value.toString(16);
        const paddedHexCode = hexCode.padStart(2, "0");
        return paddedHexCode;
      });
      return hexCodes.join("");
    };
    hmacSHA256Hex = async (text: string, key: string) => {
      const encoder = new TextEncoder();
      const hmacKey = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(key),
        {
          name: "HMAC",
          hash: { name: "SHA-256" },
        },
        true,
        ["sign", "verify"]
      );
      const digestBuffer = await window.crypto.subtle.sign(
        "HMAC",
        hmacKey,
        encoder.encode(text)
      );
      return hexString(digestBuffer);
    };
  } else {
    hmacSHA256Hex = async (text: string, key: string) => {
      // TODO replace most of code here with this new isomorphic
      // @ts-ignore
      const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
      hmac.update(text);
      const hash = hmac.finalize();
      return CryptoJS.enc.Hex.stringify(hash);
    };
  }
  const makeToken = async (
    api_key: string,
    perm: number,
    expiryInSeconds = 3600
  ): Promise<string> => {
    const id = `00${perm}`;
    const exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
    const h64 = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64");
    const p64 = Buffer.from(JSON.stringify({ id, exp })).toString("base64");
    const msg = h64 + "." + p64;
    const hash = await hmacSHA256Hex(msg, api_key);
    return `${msg}.${hash}`;
  };
  return { hmacSHA256Hex, makeToken };
};
