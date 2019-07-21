"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const agent = __importStar(require("superagent"));
const cryptoUtil_1 = require("./cryptoUtil");
const CYPHER_GATEWAY_URL = (process && process.env.CYPHERNODE_GATEWAY_URL) || "https://localhost:2009/v0/";
exports.default = (config) => {
    const { cypherGateway = CYPHER_GATEWAY_URL, transport = {
        get(command, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = yield _authToken;
                const { body } = yield agent
                    .get(`${cypherGateway}${command}/${payload ? payload : ""}`)
                    .set("Authorization", `Bearer ${token}`);
                return body;
            });
        },
        post(command, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = yield _authToken;
                const { body } = yield agent
                    .post(`${cypherGateway}${command}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(payload);
                return body;
            });
        }
    }, token, userType, apiKey } = config;
    const makeToken = (api_key = apiKey, perm = userType, expiryInSeconds = 3600) => __awaiter(this, void 0, void 0, function* () {
        const { hmacSHA256Hex } = cryptoUtil_1.crypto();
        const id = `00${perm}`;
        const exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
        const h64 = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
        const p64 = Buffer.from(JSON.stringify({ id, exp })).toString("base64");
        const msg = h64 + "." + p64;
        const hash = yield hmacSHA256Hex(msg, api_key);
        return `${msg}.${hash}`;
    });
    if (!token && (!userType || !apiKey))
        throw "You need to pass a token or userType and apiKey to generate one!";
    const _authToken = (token && Promise.resolve(token)) || makeToken();
    return Object.assign({}, transport, { makeToken, token: _authToken });
};
