"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_js_1 = __importDefault(require("crypto-js"));
// import { createHmac } from "crypto";
/**
 * Construct crypto functions needed dependig on env (Browser vs Nodde)
 * */
exports.crypto = function () {
    var hmacSHA256Hex;
    if (typeof window !== "undefined" && window.crypto) {
        var hexString_1 = function (buffer) {
            var byteArray = new Uint8Array(buffer);
            var hexCodes = __spreadArrays(byteArray).map(function (value) {
                var hexCode = value.toString(16);
                var paddedHexCode = hexCode.padStart(2, "0");
                return paddedHexCode;
            });
            return hexCodes.join("");
        };
        hmacSHA256Hex = function (text, key) { return __awaiter(void 0, void 0, void 0, function () {
            var encoder, hmacKey, digestBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encoder = new TextEncoder();
                        return [4 /*yield*/, window.crypto.subtle.importKey("raw", encoder.encode(key), {
                                name: "HMAC",
                                hash: { name: "SHA-256" }
                            }, true, ["sign", "verify"])];
                    case 1:
                        hmacKey = _a.sent();
                        return [4 /*yield*/, window.crypto.subtle.sign("HMAC", hmacKey, encoder.encode(text))];
                    case 2:
                        digestBuffer = _a.sent();
                        return [2 /*return*/, hexString_1(digestBuffer)];
                }
            });
        }); };
    }
    else {
        hmacSHA256Hex = function (text, key) { return __awaiter(void 0, void 0, void 0, function () {
            var hmac, hash;
            return __generator(this, function (_a) {
                hmac = crypto_js_1.default.algo.HMAC.create(crypto_js_1.default.algo.SHA256, key);
                hmac.update(text);
                hash = hmac.finalize();
                return [2 /*return*/, crypto_js_1.default.enc.Hex.stringify(hash)];
            });
        }); };
    }
    var makeToken = function (api_key, perm, expiryInSeconds) {
        if (expiryInSeconds === void 0) { expiryInSeconds = 3600; }
        return __awaiter(void 0, void 0, void 0, function () {
            var id, exp, h64, p64, msg, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = "00" + perm;
                        exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
                        h64 = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
                        p64 = Buffer.from(JSON.stringify({ id: id, exp: exp })).toString("base64");
                        msg = h64 + "." + p64;
                        return [4 /*yield*/, hmacSHA256Hex(msg, api_key)];
                    case 1:
                        hash = _a.sent();
                        return [2 /*return*/, msg + "." + hash];
                }
            });
        });
    };
    return { hmacSHA256Hex: hmacSHA256Hex, makeToken: makeToken };
};
