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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cypherNodeHttpTransport_1 = __importDefault(require("../transport/cypherNodeHttpTransport"));
exports.client = function (_a) {
    var _b = (_a === void 0 ? {} : _a).transport, transport = _b === void 0 ? cypherNodeHttpTransport_1.default() : _b;
    var get = transport.get, post = transport.post;
    var parseBtcAddressType = function (address) {
        var addressStart = address.substr(0, 4);
        switch (addressStart) {
            case "upub":
            case "zpub":
            case "xpub":
                return "expub";
            default:
                switch (addressStart[0]) {
                    case "1":
                        return "legacy";
                    case "3":
                        return "p2sh-segwit";
                    case "b":
                        return "bech32";
                    default:
                        return null;
                }
        }
    };
    var api = {
        getBlockChainInfo: function () {
            return get("getblockchaininfo");
        },
        getNewAddress: function (type) {
            if (type === void 0) { type = "p2sh-segwit"; }
            return __awaiter(this, void 0, void 0, function () {
                var address;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("getnewaddress", type)];
                        case 1:
                            address = (_a.sent()).address;
                            return [2 /*return*/, address];
                    }
                });
            });
        },
        getBlockHash: function (height) {
            return __awaiter(this, void 0, void 0, function () {
                var blockHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("getblockhash", height)];
                        case 1:
                            blockHash = _a.sent();
                            return [2 /*return*/, blockHash];
                    }
                });
            });
        },
        getBestBlockHash: function () {
            return __awaiter(this, void 0, void 0, function () {
                var blockHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("getbestblockhash")];
                        case 1:
                            blockHash = (_a.sent()).result;
                            return [2 /*return*/, blockHash];
                    }
                });
            });
        },
        getBestBlockInfo: function () {
            return __awaiter(this, void 0, void 0, function () {
                var blockInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("getbestblockinfo")];
                        case 1:
                            blockInfo = (_a.sent()).result;
                            return [2 /*return*/, blockInfo];
                    }
                });
            });
        },
        getBlockInfo: function (blockHash) {
            return __awaiter(this, void 0, void 0, function () {
                var blockInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("getblockinfo", blockHash)];
                        case 1:
                            blockInfo = (_a.sent()).result;
                            return [2 /*return*/, blockInfo];
                    }
                });
            });
        },
        getTxn: function (txnHash) {
            return __awaiter(this, void 0, void 0, function () {
                var txnInfo;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("gettransaction", txnHash)];
                        case 1:
                            txnInfo = (_a.sent()).result;
                            return [2 /*return*/, txnInfo];
                    }
                });
            });
        },
        getBalance: function () {
            return __awaiter(this, void 0, void 0, function () {
                var balance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("getbalance")];
                        case 1:
                            balance = (_a.sent()).balance;
                            return [2 /*return*/, balance];
                    }
                });
            });
        },
        spend: function (address, amount) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, post("spend", { address: address, amount: amount })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        },
        //  TODO Get watch list xpub , label, and tesssst
        watchAddress: function (address, options) {
            return __awaiter(this, void 0, void 0, function () {
                var command, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            command = parseBtcAddressType(address) == "expub" ? "watchxpub" : "watch";
                            if (command === "watchxpub" && (!options || !options.path))
                                throw "Must provide a derivation path for extended public addresss watches";
                            return [4 /*yield*/, post(command, __assign({ address: address }, options))];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        },
        watchTxnId: function (txn, options) {
            return __awaiter(this, void 0, void 0, function () {
                var param, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            param = __assign({ nbxconf: 6 }, options);
                            return [4 /*yield*/, post("watchtxid", __assign({ txid: txn }, param))];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        },
        getActiveAddressWatch: function () {
            return __awaiter(this, void 0, void 0, function () {
                var watches;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("getactivewatches")];
                        case 1:
                            watches = (_a.sent()).watches;
                            return [2 /*return*/, watches];
                    }
                });
            });
        },
        unwatchAddress: function (address) {
            return __awaiter(this, void 0, void 0, function () {
                var command, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            command = parseBtcAddressType(address) === "expub"
                                ? "unwatchxpubbyxpub"
                                : "unwatch";
                            return [4 /*yield*/, get(command, address)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        },
        unwatchLabel: function (label) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, get("unwatchxpubbylabel", label)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        }
    };
    return api;
};
