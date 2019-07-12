import { createHmac } from "crypto";
/**
 * Construct crypto functions needed dependig on env (Browser vs Nodde)
 * */
export const crypto = () => {
  let hmacSHA256Hex: Function;
  if (typeof window !== "undefined" && window.crypto) {
    const hexString = (buffer: ArrayBuffer) => {
      const byteArray = new Uint8Array(buffer);
      const hexCodes = [...byteArray].map(value => {
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
          hash: { name: "SHA-256" }
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
      const hmac = createHmac("sha256", <BinaryType>key);
      hmac.update(text);
      const hash = hmac.digest("hex");
      return hash;
    };
  }
  return { hmacSHA256Hex };
};
