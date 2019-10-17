var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as agent from "superagent";
import { crypto } from "../lib/cryptoUtil";
const CypherNodeGatewayUrl = (process && process.env.CYPHERNODE_GATEWAY_URL) || "https://localhost:2009/v0/";
const CypherNodeApiKey = (process && process.env.CYPHERNODE_API_KEY) || "";
const { makeToken } = crypto();
export default ({ gatewayUrl = CypherNodeGatewayUrl, auth = () => makeToken(CypherNodeApiKey, 3), } = {}) => {
    const transport = {
        get(command, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = yield auth();
                const { body } = yield agent
                    .get(`${gatewayUrl}${command}/${payload ? payload : ""}`)
                    .set("Authorization", `Bearer ${token}`);
                return body;
            });
        },
        post(command, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                const token = yield auth();
                const { body } = yield agent
                    .post(`${gatewayUrl}${command}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(payload);
                return body;
            });
        },
    };
    return Object.assign({}, transport);
};
