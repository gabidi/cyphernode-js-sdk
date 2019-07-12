"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        hmacSHA256Hex = (text, key) => __awaiter(this, void 0, void 0, function* () {
            const encoder = new TextEncoder();
            //const hmacKey = await window.crypto.subtle.generateKey(
            //  {
            //    name: "HMAC",
            //    hash: { name: "SHA-256" }
            //  },
            //  true,
            //  ["sign", "verify"]
            //);
            const digestBuffer = yield window.crypto.subtle.sign("HMAC", key, encoder.encode(text));
            return hexString(digestBuffer);
        });
    }
    else {
        hmacSHA256Hex = (text, key) => __awaiter(this, void 0, void 0, function* () {
            const hmac = crypto_1.createHmac("sha256", key);
            hmac.update(text);
            const hash = hmac.digest("hex");
            return hash;
        });
    }
    return { hmacSHA256Hex };
};
