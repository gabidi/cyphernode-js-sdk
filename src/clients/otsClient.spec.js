var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createHash } from "crypto";
import { serial } from "ava";
import { client as otsClient } from "./otsClient";
const test = serial;
test.before(t => {
    t.context = Object.assign({ fileHash: createHash("sha256")
            .update(`${Date.now}:${parseInt(Math.random() * 100)}`)
            .digest("hex") }, otsClient());
});
test("Should be able to generate an OTS file", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { stamp, fileHash } } = t;
    const hashRcpt = yield stamp(fileHash);
    t.true(hashRcpt.hash === fileHash);
    t.false(isNaN(hashRcpt.id));
    t.is(hashRcpt.result, "success");
}));
// FIXME this currently returns undefined, should return id of event to watch at least
test("Should be able to get OTS stamp", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getStamp, fileHash } } = t;
    const poop = yield getStamp("7a96ac47d6a7ac28175a10e822d14def6e8958ae5680de32fbf08083648f831e");
    console.log(poop);
}));
