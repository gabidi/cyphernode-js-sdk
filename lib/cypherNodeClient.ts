import { createHmac } from "crypto";
import * as agent from "superagent";
import debug from "debug";

type CypherNodeCommand = string;
interface CypherNodeTransport {
  get: <T>(command: CypherNodeCommand, payload?: any) => Promise<T>;
  post: <T>(command: CypherNodeCommand, payload: any) => Promise<T>;
}
interface CypherNodeClient extends CypherNodeTransport {
  makeToken: Function;
  token: String;
}

interface CypherNodeClientParam {
  transport: CypherNodeTransport;
  token: string;
  userType: number;
  apiKey: string;
  cypherGateway: string;
}
const CYPHER_GATEWAY_URL =
  (process && process.env.CYPHER_GATEWAY_URL) || "https://localhost:2009/v0/";

const d = debug("CypherNodeClient");
export default (config: CypherNodeClientParam): CypherNodeClient => {
  const {
    cypherGateway = CYPHER_GATEWAY_URL,
    transport = {
      async get<T>(command: CypherNodeCommand, payload?: any): Promise<T> {
	debug('Getting',command,payload)
        const { body } = await agent
          .get(`${cypherGateway}${command}/${payload ? payload : ""}`)
          .set("Authorization", `Bearer ${_authToken}`);
        return body;
      },
      async post<T>(command: CypherNodeCommand, payload: any): Promise<T> {
	debug('Posting',command,payload)
        const { body } = await agent
          .post(`${cypherGateway}${command}`)
          .set("Authorization", `Bearer ${_authToken}`)
          .send(payload);
        return body;
      }
    },
    token,
    userType,
    apiKey
  } = config;

  const makeToken = (
    api_key = apiKey,
    perm = userType,
    expiryInSeconds = 3600
  ): String => {
    const id = `00${perm}`;
    const exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
    const h64 = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64");
    const p64 = Buffer.from(JSON.stringify({ id, exp })).toString("base64");
    const msg = h64 + "." + p64;
    // TODO for browser
    // let hash = CryptoJS.HmacSHA256(`${h64}.${p64}`, api_key).toString();
    const hmac = createHmac("sha256", api_key);
    hmac.update(msg);
    const hash = hmac.digest("hex");
    return `${msg}.${hash}`;
  };
  // Use supplied token if provided or generate one
  const _authToken = token || makeToken();

  return {
    ...transport,
    makeToken,
    token: _authToken
  };
};
