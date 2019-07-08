import cypherNodeClient from "./lib/cypherNodeClient";
import {
  CypherNodeClient,
  CypherNodeClientParam,
  ClientConfig
} from "./lib/types/clients";
import {
  ConnectionString,
  LnNodeInfo,
  CreatedInvoice,
  CreateInvoicePayload,
  LnAddress,
  Bolt11String,
  DecodedBolt11
} from "./lib/types/lightning-c";
export default ({
  apiKey = undefined,
  userType = undefined,
  client = cypherNodeClient({ apiKey, userType })
}: ClientConfig = {}) => {
  const { get, post } = client;
  const api = {
    getNodeInfo(): Promise<LnNodeInfo> {
      return get("ln_getinfo");
    },
    async getConnectionString(): Promise<ConnectionString> {
      const { connectstring } = await get("ln_getconnectionstring");
      return connectstring;
    },
    async getNewAddress(): Promise<LnAddress> {
      const { address } = await get("ln_newaddr");
      return address;
    },
    createInvoice(invoice: CreateInvoicePayload) {
      return post<CreatedInvoice>("ln_create_invoice", invoice);
    },
    async getInvoice(invoiceLabel?: string): Promise<DecodedBolt11[]> {
      const { invoices } = await get("ln_getinvoice", invoiceLabel);
      return invoices;
    },
    decodeBolt(bolt11: Bolt11String) {
      return get<DecodedBolt11>("ln_decodebolt11", bolt11);
    }
  };
  return api;
};
