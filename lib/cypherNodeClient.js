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
    }, userType, apiKey, makeToken = cryptoUtil_1.crypto().makeToken } = config;
    // FIXME move apiKey and userType somewhere else
    // this mod allows the client to setup their own auth/not NEED to pass api/user
    const _authToken = makeToken(apiKey, userType);
    return {
        ...transport,
        token: _authToken
    };
};
