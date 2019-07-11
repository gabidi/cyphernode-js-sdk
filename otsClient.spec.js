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
        apiKey: 
        // @TODO if api key not detected, should prompt user for it https://stackoverflow.com/questions/18193953/waiting-for-user-to-enter-input-in-node-js
        process.env.CYPHERNODE_API_KEY ||
            "5b5d6ff9027dc1fdce9e84645329a194d79f346b3c7a5338d9610139c1fbd2e8",
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
    const poop = yield getStamp("16d6059a20ff61245708f7878875627504de82c168c4743776d2a61ef97ba33f");
    console.log(poop);
}));
test("Should be able to trigger backoffice upgrade", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { updateStamp, fileHash } } = t;
    const poop = yield updateStamp();
    console.log(poop);
}));
