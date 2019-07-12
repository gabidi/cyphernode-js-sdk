"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { serial, TestInterface } from "ava";
const ava_1 = require("ava");
const cypherNodeClient_1 = __importDefault(require("./cypherNodeClient"));
const crypto_1 = require("crypto");
//const test = serial as TestInterface<ClientAuth>;
//test.before(t => {});
/**
LN tests
*/
ava_1.serial("Cyphernodeclient should generate a valid auth hash", (t) => __awaiter(this, void 0, void 0, function* () {
    const apiKey = "somekey";
    const userType = 3;
    const { makeToken, token: clientToken } = cypherNodeClient_1.default({
        apiKey,
        userType
    });
    const token = yield makeToken();
    t.is(token.length, 142);
    const [h64, p64, generatedHash] = token.split(".");
    // Test generated hash vs reference
    const hmac = crypto_1.createHmac("sha256", apiKey);
    hmac.update(`${h64}.${p64}`);
    const trueHash = hmac.digest("hex");
    t.true(generatedHash === trueHash);
}));
