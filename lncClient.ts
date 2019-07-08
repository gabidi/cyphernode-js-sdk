import cypherNodeClient from "./lib/cypherNodeClient";
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
  apiKey = null,
  userType = null,
  client = cypherNodeClient({ apiKey, userType })
} = {}) => {
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
      const  {address}  = await get("ln_newaddr");
      console.log('sssss',address)
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
