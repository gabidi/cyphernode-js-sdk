import * as agent from "superagent";
//@ts-ignore
import superproxy from "superagent-proxy";

import { crypto } from "../lib/cryptoUtil";
import {
  CypherNodeHTTPTransportParam,
  CypherNodeTransport,
  CypherNodeCommand,
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
  // @ts-ignore
  auth = () => makeToken(CypherNodeApiKey, CypherNodeApiKeyID),
  // @ts-ignore
  customHeaders = async ({ command, payload }) => ({}),
}: CypherNodeHTTPTransportParam = {}): CypherNodeTransport => {
  // Extend superagent with proxyUrl
  superproxy(agent);
  const _makeHeaders = async ({ command, payload }: any) => {
    const token = await auth();
    let headers = {
      Authorization: `Bearer ${token}`,
    };
    if (typeof customHeaders === "function") {
      const headersObj = await customHeaders({ command, payload });
      if (headersObj) {
        headers = { ...headers, ...headersObj };
      }
    }
    return headers;
  };
  const transport = {
    async get<T>(command: CypherNodeCommand, payload?: any): Promise<T> {
      const { body } = await agent
        .get(`${gatewayUrl}${command}/${payload ? payload : ""}`)
        .proxy(proxyUrl!)
        .ca(CypherNodeCertCAPem)
        .set(await _makeHeaders({ command, payload }));
      return body;
    },
    async post<T>(command: CypherNodeCommand, payload: any): Promise<T> {
      // @ts-ignore
      const token = await auth();
      const { body } = await agent
        .post(`${gatewayUrl}${command}`)
        .proxy(proxyUrl!)
        .ca(CypherNodeCertCAPem)
        .set(await _makeHeaders({ command, payload }))
        .send(payload);
      return body;
    },
  };

  return {
    ...transport,
  };
};
