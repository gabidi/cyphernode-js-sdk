import * as agent from "superagent";
import superproxy from "superagent-proxy";

import { crypto } from "../lib/cryptoUtil";
import {
  CypherNodeHTTPTransportParam,
  CypherNodeTransport,
  CypherNodeCommand
} from "../lib/types/clients";
const CypherNodeGatewayUrl =
  (process && process.env.CYPHER_GATEWAY_URL) || "https://localhost:2009/v0/";
const CypherNodeApiKey = (process && process.env.CYPHERNODE_API_KEY) || "";
const CypherNodeApiKeyID = (process && process.env.CYPHERNODE_API_KEY_ID) || 3;
const CypherNodeCertCAPem =
  (process && process.env.CYPHERNODE_GATEKEEPER_CERT_CA) || "";
const { makeToken } = crypto();
export default ({
  gatewayUrl = CypherNodeGatewayUrl,
  proxyUrl = process.env.CYPHERNODE_HTTP_TRANSPORT_PROXY,
  auth = () => makeToken(CypherNodeApiKey, CypherNodeApiKeyID)
}: CypherNodeHTTPTransportParam = {}): CypherNodeTransport => {
  // Extend superagent with proxyUrl
  superproxy(agent);
  const transport = {
    async get<T>(command: CypherNodeCommand, payload?: any): Promise<T> {
      const token = await auth();
      const { body } = await agent
        .get(`${gatewayUrl}${command}/${payload ? payload : ""}`)
        .proxy(proxyUrl)
        .ca(CypherNodeCertCAPem)
        .set("Authorization", `Bearer ${token}`);
      return body;
    },
    async post<T>(command: CypherNodeCommand, payload: any): Promise<T> {
      const token = await auth();
      const { body } = await agent
        .post(`${gatewayUrl}${command}`)
        .proxy(proxyUrl)
        .ca(CypherNodeCertCAPem)
        .set("Authorization", `Bearer ${token}`)
        .send(payload);
      return body;
    }
  };

  return {
    ...transport
  };
};
