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
test.before((t) => __awaiter(this, void 0, void 0, function* () {
    const client = btcClient_1.client({
        apiKey: process.env.CYPHERNODE_API_KEY,
        userType: 3
    });
    // check which chain we're on
    const { chain } = yield client.getBlockChainInfo();
    if (!chain)
        throw "Could not get blockChainInfo or undefined chain type";
    if (chain === "main")
        console.warn("**** WARNING: RUNNING TESTS ON MAINNET!!! *****");
    t.context = Object.assign({}, client, { chain });
}));
/**
BTC tests
*/
test("Should be able to get a new legacy, p2sh or bech32 bitcoin address ", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getNewAddress, chain } } = t;
    const addressTypes = {
        legacy: ["1", "2"],
        "p2sh-segwit": ["3", "2"],
        bech32: ["b", "2"]
    };
    yield Promise.all(Object.entries(addressTypes).map(([addressType, addressFirstChar]) => __awaiter(this, void 0, void 0, function* () {
        const address = yield getNewAddress(addressType);
        t.true(address.length >= 33);
        // Test based on what chain we're on
        t.is(address[0].toString(), addressFirstChar[chain === "main" ? 0 : 1]);
    })));
}));
test("Should be able to get the latest block's hash", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getBestBlockHash } } = t;
    const blockHash = yield getBestBlockHash();
    t.is(blockHash.length, 64);
}));
test("Should be able to get the lastest block's info", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getBestBlockInfo } } = t;
    const blockInfo = yield getBestBlockInfo();
    t.true(!!blockInfo.hash.length);
    t.true(!isNaN(blockInfo.height));
    t.true(!isNaN(blockInfo.time));
    t.true(!!blockInfo.tx.length);
}));
test("Should be able to get the any block's info", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getBlockInfo, chain } } = t;
    if (chain === "test")
        return;
    const blockHash = "0000000000000000001c6a6ae90f3f90f9a02098f5f447dc3ee09649097fa2cf";
    const blockInfo = yield getBlockInfo(blockHash);
    t.true(!!blockInfo.hash.length);
    t.true(!isNaN(blockInfo.height));
    t.true(!isNaN(blockInfo.time));
    t.true(!!blockInfo.tx.length);
}));
test("Should be able to get a transactions info", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getTxn, chain } } = t;
    if (chain === "test")
        return;
    const txnId = "356a61085702ef1b89c8027a4169b124f09e157577494ea6dcfe81cb5065aaba ";
    const txnInfo = yield getTxn(txnId);
    t.true(!!txnInfo.txid.length);
    t.true(txnInfo.confirmations > 1);
    t.true(txnInfo.time > 1);
    t.true(txnInfo.blocktime > 1);
}));
test("Should be able to get a wallets balance", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getBalance } } = t;
    const balance = yield getBalance();
    t.false(isNaN(balance));
}));
