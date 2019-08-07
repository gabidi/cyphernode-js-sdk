"use strict";
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
const CYPHER_GATEWAY_URL = (process && process.env.CYPHERNODE_GATEWAY_URL) ||
    "https://localhost:2009/v0/";
exports.default = (config) => {
    const { cypherGateway = CYPHER_GATEWAY_URL, transport = {
        async get(command, payload) {
            const token = await _authToken;
            const { body } = await agent
                .get(`${cypherGateway}${command}/${payload ? payload : ""}`)
                .set("Authorization", `Bearer ${token}`);
            return body;
        },
        async post(command, payload) {
            const token = await _authToken;
            const { body } = await agent
                .post(`${cypherGateway}${command}`)
                .set("Authorization", `Bearer ${token}`)
                .send(payload);
            return body;
        }
    }, token, userType, apiKey } = config;
    const makeToken = async (api_key = apiKey, perm = userType, expiryInSeconds = 3600) => {
        const { hmacSHA256Hex } = cryptoUtil_1.crypto();
        const id = `00${perm}`;
        const exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
        const h64 = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
        const p64 = Buffer.from(JSON.stringify({ id, exp })).toString("base64");
        const msg = h64 + "." + p64;
        const hash = await hmacSHA256Hex(msg, api_key);
        return `${msg}.${hash}`;
    };
    if (!token && (!userType || !apiKey))
        throw "You need to pass a token or userType and apiKey to generate one!";
    const _authToken = (token && Promise.resolve(token)) || makeToken();
    return {
        ...transport,
        makeToken,
        token: _authToken
    };
};
