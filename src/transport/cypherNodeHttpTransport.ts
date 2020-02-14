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
export default ({
  gatewayUrl = CypherNodeGatewayUrl,
  proxyUrl = process.env.CYPHERNODE_HTTP_TRANSPORT_PROXY,
  auth,
  agent
}: CypherNodeHTTPTransportParam = {}): CypherNodeTransport => {
  if (!auth || !agent) throw "Missing authentication and or agent";
  // Extend superagent with proxyUrl
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
