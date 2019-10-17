var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import { serial, TestInterface } from "ava";
import { serial as test } from "ava";
import { crypto } from "./cryptoUtil";
import { createHmac } from "crypto";
//const test = serial as TestInterface<ClientAuth>;
//test.before(t => {});
/**
LN tests
*/
test("hmacSHA256Hex should generate a hash identifcal to reference fn", (t) => __awaiter(this, void 0, void 0, function* () {
    const { hmacSHA256Hex } = crypto();
    const text = "Text to hash";
    const key = "SomeKey";
    const hmac = createHmac("sha256", key);
    hmac.update(text);
    const trueHash = hmac.digest("hex");
    const token = yield hmacSHA256Hex(text, key);
    t.true(token === trueHash);
}));
test("Cyphernodeclient should generate a valid auth hash", (t) => __awaiter(this, void 0, void 0, function* () {
    const apiKey = "somekey";
    const userType = 3;
    const { makeToken } = crypto();
    const token = yield makeToken(apiKey, userType);
    t.is(token.length, 142);
    const [h64, p64, generatedHash] = token.split(".");
    // Test generated hash vs reference
    const hmac = createHmac("sha256", apiKey);
    hmac.update(`${h64}.${p64}`);
    const trueHash = hmac.digest("hex");
    t.true(generatedHash === trueHash);
}));
