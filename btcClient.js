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
const cypherNodeClient_1 = __importDefault(require("./lib/cypherNodeClient"));
exports.client = ({ apiKey = undefined, userType = undefined, token = undefined, cypherGateway = undefined, client = cypherNodeClient_1.default({ token, apiKey, userType, cypherGateway }) } = {}) => {
    const { get, post } = client;
    const api = {
        getNewAddress(type = "p2sh-segwit") {
            return __awaiter(this, void 0, void 0, function* () {
                const { address } = yield get("getnewaddress", type);
                return address;
            });
        },
        getBestBlockHash() {
            return __awaiter(this, void 0, void 0, function* () {
                const { result: blockHash } = yield get("getbestblockhash");
                return blockHash;
            });
        },
        getBestBlockInfo() {
            return __awaiter(this, void 0, void 0, function* () {
                const { result: blockInfo } = yield get("getbestblockinfo");
                return blockInfo;
            });
        },
        getBlockInfo(blockHash) {
            return __awaiter(this, void 0, void 0, function* () {
                const { result: blockInfo } = yield get("getblockinfo", blockHash);
                return blockInfo;
            });
        },
        getTxn(txnHash) {
            return __awaiter(this, void 0, void 0, function* () {
                const { result: txnInfo } = yield get("gettransaction", txnHash);
                return txnInfo;
            });
        },
        getBalance() {
            return __awaiter(this, void 0, void 0, function* () {
                const { balance } = yield get("getbalance");
                return balance;
            });
        },
        watch(address) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield post("watch", {
                    address,
                    unconfirmedCallbackURL: "",
                    confirmedCallbackURL: ""
                });
                return result;
            });
        },
        unwatch(address) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield post("unwatch", {
                    address
                });
                return result;
            });
        }
    };
    return api;
};
