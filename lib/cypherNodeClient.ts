import * as agent from "superagent";
import { crypto } from "./cryptoUtil";
import {
  CypherNodeClient,
  CypherNodeClientParam,
  CypherNodeCommand
} from "./types/clients";
const CYPHER_GATEWAY_URL =
  (process && process.env.CYPHER_GATEWAY_URL) || "https://localhost:2009/v0/";

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
    token,
    userType,
    apiKey
  } = config;
  const makeToken = async (
    api_key = apiKey,
    perm = userType,
    expiryInSeconds = 3600
  ): Promise<string> => {
    const { hmacSHA256Hex } = crypto();
    const id = `00${perm}`;
    const exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
    const h64 = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64");
    const p64 = Buffer.from(JSON.stringify({ id, exp })).toString("base64");
    const msg = h64 + "." + p64;
    const hash = await hmacSHA256Hex(msg, api_key);
    return `${msg}.${hash}`;
  };
  if (!token && (!userType || !apiKey))
    throw "You need to pass a token or userType and apiKey to generate one!";
  const _authToken: Promise<string> =
    (token && Promise.resolve(token)) || makeToken();

  return {
    ...transport,
    makeToken,
    token: _authToken
  };
};
