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
const ava_1 = require("ava");
const otsClient_1 = require("./otsClient");
const test = ava_1.serial;
test.before(t => {
    t.context = Object.assign({ fileHash: crypto_1.createHash("sha256")
            .update(`${Date.now}:${parseInt(Math.random() * 100)}`)
            .digest("hex") }, otsClient_1.client({
        apiKey: process.env.CYPHERNODE_API_KEY,
        userType: 3
    }));
});
/**
/*

OTS  test
*/
test.skip("Should be able to generate an OTS file", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { stamp, fileHash } } = t;
    const hashRcpt = yield stamp(fileHash);
    t.true(hashRcpt.hash === fileHash);
    t.false(isNaN(hashRcpt.id));
    t.is(hashRcpt.result, "success");
}));
test("Should be able to get OTS stamp", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getStamp, fileHash } } = t;
    const poop = yield getStamp("7a96ac47d6a7ac28175a10e822d14def6e8958ae5680de32fbf08083648f831e");
    console.log(poop);
}));
