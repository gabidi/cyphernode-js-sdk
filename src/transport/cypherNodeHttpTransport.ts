import * as agent from "superagent";
import { crypto } from "../lib/cryptoUtil";
import {
  CypherNodeHTTPTransportParam,
  CypherNodeTransport,
  CypherNodeCommand
} from "../lib/types/clients";
const CypherNodeGatewayUrl =
  (process && process.env.CYPHER_GATEWAY_URL) ||
  "https://localhost:2009/v0/";
const CypherNodeApiKey = (process && process.env.CYPHERNODE_API_KEY) || "";
const { makeToken } = crypto();
export default ({
  gatewayUrl = CypherNodeGatewayUrl,
  auth = () => makeToken(CypherNodeApiKey, 3)
}: CypherNodeHTTPTransportParam = {}): CypherNodeTransport => {
  const transport = {
    async get<T>(command: CypherNodeCommand, payload?: any): Promise<T> {
      const token = await auth();
      const { body } = await agent
        .get(`${gatewayUrl}${command}/${payload ? payload : ""}`)
        .set("Authorization", `Bearer ${token}`);
      return body;
    },
    async post<T>(command: CypherNodeCommand, payload: any): Promise<T> {
      const token = await auth();
      const { body } = await agent
        .post(`${gatewayUrl}${command}`)
        .set("Authorization", `Bearer ${token}`)
        .send(payload);
      return body;
    }
  };

  return {
    ...transport
  };
};
