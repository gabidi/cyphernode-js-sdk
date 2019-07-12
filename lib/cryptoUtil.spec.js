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
// import { serial, TestInterface } from "ava";
const ava_1 = require("ava");
const cryptoUtil_1 = require("./cryptoUtil");
const crypto_1 = require("crypto");
//const test = serial as TestInterface<ClientAuth>;
//test.before(t => {});
/**
LN tests
*/
ava_1.serial("hmacSHA256Hex should generate a hash identifcal to reference fn", (t) => __awaiter(this, void 0, void 0, function* () {
    const { hmacSHA256Hex } = cryptoUtil_1.crypto();
    const text = "Text to hash";
    const key = "SomeKey";
    const hmac = crypto_1.createHmac("sha256", key);
    hmac.update(text);
    const trueHash = hmac.digest("hex");
    const token = yield hmacSHA256Hex(text, key);
    t.true(token === trueHash);
}));
