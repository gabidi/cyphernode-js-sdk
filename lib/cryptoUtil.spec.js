"use strict";
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
ava_1.serial("hmacSHA256Hex should generate a hash identifcal to reference fn", async (t) => {
    const { hmacSHA256Hex } = cryptoUtil_1.crypto();
    const text = "Text to hash";
    const key = "SomeKey";
    const hmac = crypto_1.createHmac("sha256", key);
    hmac.update(text);
    const trueHash = hmac.digest("hex");
    const token = await hmacSHA256Hex(text, key);
    t.true(token === trueHash);
});
