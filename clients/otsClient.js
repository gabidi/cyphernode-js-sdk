"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cypherNodeClient_1 = __importDefault(require("../lib/cypherNodeClient"));
exports.client = ({ apiKey = undefined, userType = undefined, token = undefined, cypherGateway = undefined, client = cypherNodeClient_1.default({ token, apiKey, userType, cypherGateway }) } = {}) => {
    const { get, post } = client;
    const api = {
        async stamp(fileHash) {
            const stampRct = await post("ots_stamp", { hash: fileHash });
            return stampRct;
        },
        async getStamp(fileHash) {
            const poop = await get("ots_getfile", fileHash);
            return poop;
        }
    };
    return api;
};
