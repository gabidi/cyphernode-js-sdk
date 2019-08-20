"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
/**
 * Construct crypto functions needed dependig on env (Browser vs Nodde)
 * */
exports.crypto = () => {
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
        hmacSHA256Hex = async (text, key) => {
            const encoder = new TextEncoder();
            const hmacKey = await window.crypto.subtle.importKey("raw", encoder.encode(key), {
                name: "HMAC",
                hash: { name: "SHA-256" }
            }, true, ["sign", "verify"]);
            const digestBuffer = await window.crypto.subtle.sign("HMAC", hmacKey, encoder.encode(text));
            return hexString(digestBuffer);
        };
    }
    else {
        hmacSHA256Hex = async (text, key) => {
            const hmac = crypto_1.createHmac("sha256", key);
            hmac.update(text);
            const hash = hmac.digest("hex");
            return hash;
        };
    }
    return { hmacSHA256Hex };
};
