var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cypherNodeHTTPTransport from "../transport/cypherNodeHttpTransport";
export const client = ({ transport = cypherNodeHTTPTransport() } = {}) => {
    const { get, post } = transport;
    const parseBtcAddressType = (address) => {
        const addressStart = address.substr(0, 4);
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
    const api = {
        getBlockChainInfo() {
            return get("getblockchaininfo");
        },
        getNewAddress(type = "p2sh-segwit") {
            return __awaiter(this, void 0, void 0, function* () {
                const { address } = yield get("getnewaddress", type);
                return address;
            });
        },
        getBlockHash(height) {
            return __awaiter(this, void 0, void 0, function* () {
                const blockHash = yield get("getblockhash", height);
                return blockHash;
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
        spend(address, amount) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield post("spend", { address, amount });
                return result;
            });
        },
        //  TODO Get watch list xpub , label, and tesssst
        watchAddress(address, options) {
            return __awaiter(this, void 0, void 0, function* () {
                const command = parseBtcAddressType(address) == "expub" ? "watchxpub" : "watch";
                if (command === "watchxpub" && (!options || !options.path))
                    throw "Must provide a derivation path for extended public addresss watches";
                const result = yield post(command, Object.assign({ address }, options));
                return result;
            });
        },
        watchTxnId(txn, options) {
            return __awaiter(this, void 0, void 0, function* () {
                let param = Object.assign({ nbxconf: 6 }, options);
                const result = yield post("watchtxid", Object.assign({ txid: txn }, param));
                return result;
            });
        },
        getActiveAddressWatch() {
            return __awaiter(this, void 0, void 0, function* () {
                const { watches } = yield get("getactivewatches");
                return watches;
            });
        },
        unwatchAddress(address) {
            return __awaiter(this, void 0, void 0, function* () {
                const command = parseBtcAddressType(address) === "expub"
                    ? "unwatchxpubbyxpub"
                    : "unwatch";
                const result = yield get(command, address);
                return result;
            });
        },
        unwatchLabel(label) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield get("unwatchxpubbylabel", label);
                return result;
            });
        }
    };
    return api;
};
