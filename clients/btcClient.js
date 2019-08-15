"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cypherNodeClient_1 = __importDefault(require("../lib/cypherNodeClient"));
exports.client = ({ apiKey = undefined, userType = undefined, token = undefined, cypherGateway = undefined, client = cypherNodeClient_1.default({ token, apiKey, userType, cypherGateway }) } = {}) => {
    const { get, post } = client;
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
        async getNewAddress(type = "p2sh-segwit") {
            const { address } = await get("getnewaddress", type);
            return address;
        },
        async getBestBlockHash() {
            const { result: blockHash } = await get("getbestblockhash");
            return blockHash;
        },
        async getBestBlockInfo() {
            const { result: blockInfo } = await get("getbestblockinfo");
            return blockInfo;
        },
        async getBlockInfo(blockHash) {
            const { result: blockInfo } = await get("getblockinfo", blockHash);
            return blockInfo;
        },
        async getTxn(txnHash) {
            const { result: txnInfo } = await get("gettransaction", txnHash);
            return txnInfo;
        },
        async getBalance() {
            const { balance } = await get("getbalance");
            return balance;
        },
        async spend(address, amount) {
            const result = await post("spend", { address, amount });
            return result;
        },
        //  TODO Get watch list xpub , label, and tesssst
        async watchAddress(address, options) {
            const command = parseBtcAddressType(address) == "expub" ? "watchxpub" : "watch";
            if (command === "watchxpub" && (!options || !options.path))
                throw "Must provide a derivation path for extended public addresss watches";
            const result = await post(command, {
                address,
                ...options
            });
            return result;
        },
        async watchTxnId(txn, options) {
            let param = {
                nbxconf: 6,
                ...options
            };
            const result = await post("watchtxid", { txid: txn, ...param });
            return result;
        },
        async getActiveAddressWatch() {
            const { watches } = await get("getactivewatches");
            return watches;
        },
        async unwatchAddress(address) {
            const command = parseBtcAddressType(address) === "expub"
                ? "unwatchxpubbyxpub"
                : "unwatch";
            const result = await get(command, address);
            return result;
        },
        async unwatchLabel(label) {
            const result = await get("unwatchxpubbylabel", label);
            return result;
        }
    };
    return api;
};
