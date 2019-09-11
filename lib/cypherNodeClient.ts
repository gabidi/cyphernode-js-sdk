import * as agent from "superagent";
import { crypto } from "./cryptoUtil";
import {
  CypherNodeClient,
  CypherNodeClientParam,
  CypherNodeCommand
} from "./types/clients";
const CYPHER_GATEWAY_URL =
  (process && process.env.CYPHERNODE_GATEWAY_URL) ||
  "https://localhost:2009/v0/";

export default (config: CypherNodeClientParam): CypherNodeClient => {
  const {
    cypherGateway = CYPHER_GATEWAY_URL,
    transport = {
      async get<T>(command: CypherNodeCommand, payload?: any): Promise<T> {
        const token = await _authToken;
        const { body } = await agent
          .get(`${cypherGateway}${command}/${payload ? payload : ""}`)
          .set("Authorization", `Bearer ${token}`);
        return body;
      },
      async post<T>(command: CypherNodeCommand, payload: any): Promise<T> {
        const token = await _authToken;
        const { body } = await agent
          .post(`${cypherGateway}${command}`)
          .set("Authorization", `Bearer ${token}`)
          .send(payload);
        return body;
      }
    },
    userType,
    apiKey,
    makeToken = crypto().makeToken
  } = config;
  // FIXME move apiKey and userType somewhere else
  // this mod allows the client to setup their own auth/not NEED to pass api/user
  const _authToken: Promise<string> = makeToken(apiKey, userType);

  return {
    ...transport,
    token: _authToken
  };
};
