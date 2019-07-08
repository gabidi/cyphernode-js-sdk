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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const agent = __importStar(require("superagent"));
const debug_1 = __importDefault(require("debug"));
const CYPHER_GATEWAY_URL = (process && process.env.CYPHER_GATEWAY_URL) || "https://localhost:2009/v0/";
const d = debug_1.default("CypherNodeClient");
exports.default = (config) => {
    const { cypherGateway = CYPHER_GATEWAY_URL, transport = {
        get(command, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                debug_1.default('Getting', command, payload);
                const { body } = yield agent
                    .get(`${cypherGateway}${command}/${payload ? payload : ""}`)
                    .set("Authorization", `Bearer ${_authToken}`);
                return body;
            });
        },
        post(command, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                debug_1.default('Posting', command, payload);
                const { body } = yield agent
                    .post(`${cypherGateway}${command}`)
                    .set("Authorization", `Bearer ${_authToken}`)
                    .send(payload);
                return body;
            });
        }
    }, token, userType, apiKey } = config;
    const makeToken = (api_key = apiKey, perm = userType, expiryInSeconds = 3600) => {
        const id = `00${perm}`;
        const exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
        const h64 = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
        const p64 = Buffer.from(JSON.stringify({ id, exp })).toString("base64");
        const msg = h64 + "." + p64;
        // TODO for browser
        // let hash = CryptoJS.HmacSHA256(`${h64}.${p64}`, api_key).toString();
        const hmac = crypto_1.createHmac("sha256", api_key);
        hmac.update(msg);
        const hash = hmac.digest("hex");
        return `${msg}.${hash}`;
    };
    // Use supplied token if provided or generate one
    const _authToken = token || makeToken();
    return Object.assign({}, transport, { makeToken, token: _authToken });
};
