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
const ava_1 = require("ava");
const btcClient_1 = require("./btcClient");
const test = ava_1.serial;
test.before(t => {
    t.context = Object.assign({}, btcClient_1.client({
        apiKey: process.env.CYPHERNODE_API_KEY ||
            "5b5d6ff9027dc1fdce9e84645329a194d79f346b3c7a5338d9610139c1fbd2e8",
        userType: 3
    }));
});
/**
BTC tests
*/
test("Should be able to get a new bitcoin address", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getNewAddress } } = t;
    const address = yield getNewAddress();
    t.is(address.length, 34);
    t.is(address[0], "3");
}));
test("Should be able to get the latest block's hash", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getBestBlockHash } } = t;
    const blockHash = yield getBestBlockHash();
    t.is(blockHash.length, 64);
}));
test("Should be able to get the latest block's info", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getBlockInfo } } = t;
    const blockHash = "0000000000000000001c6a6ae90f3f90f9a02098f5f447dc3ee09649097fa2cf";
    const blockInfo = yield getBlockInfo(blockHash);
    t.true(!!blockInfo.hash.length);
    t.true(!isNaN(blockInfo.height));
    t.true(!isNaN(blockInfo.time));
    t.true(!!blockInfo.tx.length);
}));
test("Should be able to get a transactions info", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getTxn } } = t;
    const txnId = "356a61085702ef1b89c8027a4169b124f09e157577494ea6dcfe81cb5065aaba ";
    const txnInfo = yield getTxn(txnId);
    t.true(!!txnInfo.txid.length);
    t.true(txnInfo.confirmations > 1);
    t.true(txnInfo.time > 1);
    t.true(txnInfo.blocktime > 1);
}));
