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
exports.client = ({ apiKey = undefined, userType = undefined, client = cypherNodeClient_1.default({ apiKey, userType }) } = {}) => {
    const { get, post } = client;
    const api = {
        stamp(fileHash) {
            return __awaiter(this, void 0, void 0, function* () {
                const stampRct = yield post("ots_stamp", { hash: fileHash });
                return stampRct;
            });
        },
        getStamp(fileHash) {
            return __awaiter(this, void 0, void 0, function* () {
                const poop = yield get("ots_getfile", fileHash);
                return poop;
            });
        }
    };
    return api;
};
