"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var btcClient_1 = require("./btcClient");
var test = ava_1.serial;
test.before(function (t) { return __awaiter(_this, void 0, void 0, function () {
    var client, chain;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = btcClient_1.client();
                return [4 /*yield*/, client.getBlockChainInfo()];
            case 1:
                chain = (_a.sent()).chain;
                if (!chain)
                    throw "Could not get blockChainInfo or undefined chain type";
                if (chain === "main")
                    console.warn("**** WARNING: RUNNING TESTS ON MAINNET!!! *****");
                t.context = __assign({}, client, { chain: chain });
                return [2 /*return*/];
        }
    });
}); });
/**
BTC tests
*/
test("Should be able to get a new legacy, p2sh or bech32 bitcoin address ", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, getNewAddress, chain, addressTypes;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = t.context, getNewAddress = _a.getNewAddress, chain = _a.chain;
                addressTypes = {
                    legacy: ["1", "m"],
                    "p2sh-segwit": ["3", "2"],
                    bech32: ["b", "2"]
                };
                return [4 /*yield*/, Promise.all(Object.entries(addressTypes).map(function (_a) {
                        var addressType = _a[0], addressFirstChar = _a[1];
                        return __awaiter(_this, void 0, void 0, function () {
                            var address;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, getNewAddress(addressType)];
                                    case 1:
                                        address = _b.sent();
                                        t.true(address.length >= 33);
                                        // TODO remove this and fix address prefix for testnet tests
                                        if (chain === "main")
                                            t.is(address[0].toString(), addressFirstChar[chain === "main" ? 0 : 1]);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }))];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get the latest block's hash", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var getBestBlockHash, blockHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getBestBlockHash = t.context.getBestBlockHash;
                return [4 /*yield*/, getBestBlockHash()];
            case 1:
                blockHash = _a.sent();
                t.is(blockHash.length, 64);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get the a block's hash from its height", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, getBlockHash, chain, blockHash;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = t.context, getBlockHash = _a.getBlockHash, chain = _a.chain;
                return [4 /*yield*/, getBlockHash(593104)];
            case 1:
                blockHash = _b.sent();
                // testnet blocks can change, so only do actaul verification of blochash on mainnet
                if (chain === "main")
                    t.is(blockHash, "00000000000000000005dc459f0575b17413dbe7685e3e0fd382ed521f1be68b");
                else
                    t.true(!!blockHash.length);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get the lastest block's info", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var getBestBlockInfo, blockInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getBestBlockInfo = t.context.getBestBlockInfo;
                return [4 /*yield*/, getBestBlockInfo()];
            case 1:
                blockInfo = _a.sent();
                t.true(!!blockInfo.hash.length);
                t.true(!isNaN(blockInfo.height));
                t.true(!isNaN(blockInfo.time));
                t.true(!!blockInfo.tx.length);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get the any block's info", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, getBlockInfo, chain, blockHash, blockInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = t.context, getBlockInfo = _a.getBlockInfo, chain = _a.chain;
                if (chain === "test") {
                    t.pass();
                    return [2 /*return*/];
                }
                blockHash = "0000000000000000001c6a6ae90f3f90f9a02098f5f447dc3ee09649097fa2cf";
                return [4 /*yield*/, getBlockInfo(blockHash)];
            case 1:
                blockInfo = _b.sent();
                t.true(!!blockInfo.hash.length);
                t.true(!isNaN(blockInfo.height));
                t.true(!isNaN(blockInfo.time));
                t.true(!!blockInfo.tx.length);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get a transactions info", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, getTxn, chain, txnId, txnInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = t.context, getTxn = _a.getTxn, chain = _a.chain;
                if (chain !== "main") {
                    t.pass();
                    return [2 /*return*/];
                }
                txnId = "356a61085702ef1b89c8027a4169b124f09e157577494ea6dcfe81cb5065aaba ";
                return [4 /*yield*/, getTxn(txnId)];
            case 1:
                txnInfo = _b.sent();
                t.true(!!txnInfo.txid.length);
                t.true(txnInfo.confirmations > 1);
                t.true(txnInfo.time > 1);
                t.true(txnInfo.blocktime > 1);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get the spending wallets balance", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var getBalance, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getBalance = t.context.getBalance;
                return [4 /*yield*/, getBalance()];
            case 1:
                balance = _a.sent();
                t.false(isNaN(balance));
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to spend (will only run when testnet)", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, getBalance, getNewAddress, spend, chain, _b, balance, sendToAddress, _c, status, hash;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = t.context, getBalance = _a.getBalance, getNewAddress = _a.getNewAddress, spend = _a.spend, chain = _a.chain;
                if (chain !== "test") {
                    t.pass();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Promise.all([
                        getBalance(),
                        getNewAddress()
                    ])];
            case 1:
                _b = _d.sent(), balance = _b[0], sendToAddress = _b[1];
                if (balance <= 0)
                    t.fail("Not enough funds to run spend test");
                return [4 /*yield*/, spend(sendToAddress, balance / 1000)];
            case 2:
                _c = _d.sent(), status = _c.status, hash = _c.hash;
                t.is(status, "accepted");
                return [2 /*return*/];
        }
    });
}); });
/* Watch Pub32 tests */
test("Should be able to get a list of watched Pub32 and their labels", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var getWatchedPub32, watchedPub32;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getWatchedPub32 = t.context.getWatchedPub32;
                return [4 /*yield*/, getWatchedPub32()];
            case 1:
                watchedPub32 = _a.sent();
                t.true(Array.isArray(watchedPub32));
                if (watchedPub32.length < 1)
                    t.pass();
                else {
                    t.true(watchedPub32.every(function (_a) {
                        var pub32 = _a.pub32, label = _a.label;
                        return pub32.length && label.length;
                    }));
                }
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to watch a pub32", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, watchPub32, chain, tpub, pub32label, watchOptions, _b, label, pub32, id;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = t.context, watchPub32 = _a.watchPub32, chain = _a.chain;
                tpub = chain === "main"
                    ? "xpub6AHA9hZDN11k2ijHMeS5QqHx2KP9aMBRhTDqANMnwVtdyw2TDYRmF8PjpvwUFcL1Et8Hj59S3gTSMcUQ5gAqTz3Wd8EsMTmF3DChhqPQBnU"
                    : "tpubDAenfwNu5GyCJWv8oqRAckdKMSUoZjgVF5p8WvQwHQeXjDhAHmGrPa4a4y2Fn7HF2nfCLefJanHV3ny1UY25MRVogizB2zRUdAo7Tr9XAjm";
                pub32label = "js_sdkpub32_test";
                watchOptions = {
                    label: pub32label,
                    nstart: 0,
                    path: "0/n"
                };
                return [4 /*yield*/, watchPub32(tpub, watchOptions)];
            case 1:
                _b = _c.sent(), label = _b.label, pub32 = _b.pub32, id = _b.id;
                t.false(isNaN(id));
                t.is(pub32, tpub);
                t.is(label, watchOptions.label);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get watched address for 32pub by labe", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var getWatchedAddressesByPub32Label, pub32Label, watchedAddresses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getWatchedAddressesByPub32Label = t.context.getWatchedAddressesByPub32Label;
                pub32Label = "js_sdkpub32_test";
                return [4 /*yield*/, getWatchedAddressesByPub32Label(pub32Label)];
            case 1:
                watchedAddresses = _a.sent();
                t.true(watchedAddresses.length > 0);
                t.true(watchedAddresses.every(function (_a) {
                    var address = _a.address;
                    return address.length === 34;
                }));
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get a watched 32pub's balance by label", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var getBalanceByPub32Label, pub32Label, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getBalanceByPub32Label = t.context.getBalanceByPub32Label;
                pub32Label = "js_sdkpub32_test";
                return [4 /*yield*/, getBalanceByPub32Label(pub32Label)];
            case 1:
                balance = _a.sent();
                t.true(!isNaN(balance));
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get a watched 32pub's unused addresses", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var getUnusedAddressesByPub32Label, pub32Label, unusedAddressList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getUnusedAddressesByPub32Label = t.context.getUnusedAddressesByPub32Label;
                pub32Label = "js_sdkpub32_test";
                return [4 /*yield*/, getUnusedAddressesByPub32Label(pub32Label)];
            case 1:
                unusedAddressList = _a.sent();
                t.true(Array.isArray(unusedAddressList));
                t.true(unusedAddressList.every(function (_a) {
                    var address = _a.address, address_pub32_index = _a.address_pub32_index;
                    return !!address.length && !isNaN(address_pub32_index);
                }));
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get transactions for watch label ", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var getTransactionsByPub32Label, pub32Label, pub32Txns;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getTransactionsByPub32Label = t.context.getTransactionsByPub32Label;
                pub32Label = "js_sdkpub32_test";
                return [4 /*yield*/, getTransactionsByPub32Label(pub32Label)];
            case 1:
                pub32Txns = _a.sent();
                t.true(Array.isArray(pub32Txns));
                t.true(pub32Txns.every(function (_a) {
                    var amount = _a.amount, txid = _a.txid;
                    return !!txid.length && !isNaN(amount);
                }));
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to unwatch by label", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var unwatchPub32ByLabel, pub32Label, label;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                unwatchPub32ByLabel = t.context.unwatchPub32ByLabel;
                pub32Label = "js_sdkpub32_test";
                return [4 /*yield*/, unwatchPub32ByLabel(pub32Label)];
            case 1:
                label = (_a.sent()).label;
                t.is(label, pub32Label);
                return [2 /*return*/];
        }
    });
}); });
