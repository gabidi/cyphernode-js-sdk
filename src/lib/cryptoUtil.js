var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createHmac } from "crypto";
/**
 * Construct crypto functions needed dependig on env (Browser vs Nodde)
 * */
export const crypto = () => {
    let hmacSHA256Hex;
    if (typeof window !== "undefined" && window.crypto) {
        const hexString = (buffer) => {
            const byteArray = new Uint8Array(buffer);
            const hexCodes = [...byteArray].map(value => {
                const hexCode = value.toString(16);
                const paddedHexCode = hexCode.padStart(2, "0");
                return paddedHexCode;
            });
            return hexCodes.join("");
        };
        hmacSHA256Hex = (text, key) => __awaiter(this, void 0, void 0, function* () {
            const encoder = new TextEncoder();
            const hmacKey = yield window.crypto.subtle.importKey("raw", encoder.encode(key), {
                name: "HMAC",
                hash: { name: "SHA-256" }
            }, true, ["sign", "verify"]);
            const digestBuffer = yield window.crypto.subtle.sign("HMAC", hmacKey, encoder.encode(text));
            return hexString(digestBuffer);
        });
    }
    else {
        hmacSHA256Hex = (text, key) => __awaiter(this, void 0, void 0, function* () {
            const hmac = createHmac("sha256", key);
            hmac.update(text);
            const hash = hmac.digest("hex");
            return hash;
        });
    }
    const makeToken = (api_key, perm, expiryInSeconds = 3600) => __awaiter(this, void 0, void 0, function* () {
        const id = `00${perm}`;
        const exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
        const h64 = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
        const p64 = Buffer.from(JSON.stringify({ id, exp })).toString("base64");
        const msg = h64 + "." + p64;
        const hash = yield hmacSHA256Hex(msg, api_key);
        return `${msg}.${hash}`;
    });
    return { hmacSHA256Hex, makeToken };
};
