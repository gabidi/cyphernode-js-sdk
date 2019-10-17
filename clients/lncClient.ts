import cypherNodeHTTPTransport from "../transport/cypherNodeHttpTransport";
import {
  ClientConfig
} from "../lib/types/clients";
import {
  ConnectionString,
  LnNodeInfo,
  CreatedInvoice,
  CreateInvoicePayload,
  LnAddress,
  Bolt11String,
  DecodedBolt11,
  CypherNodeLncClient
} from "../lib/types/lightning-c";
export const client = ({
  transport = cypherNodeHTTPTransport()
}: ClientConfig = {}): CypherNodeLncClient => {
  const { get, post } = transport;
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
    createInvoice(invoice: CreateInvoicePayload): Promise<CreatedInvoice> {
      return post("ln_create_invoice", invoice);
    },
    async getInvoice(invoiceLabel?: string): Promise<CreatedInvoice[]> {
      const { invoices } = await get("ln_getinvoice", invoiceLabel);
      return invoices;
    },
    /** FAILS 403 */
    async deleteInvoice(invoiceLabel?: string): Promise<CreatedInvoice> {
      const invoice = await get("ln_delinvoice", invoiceLabel);
      return invoice;
    },
    decodeBolt(bolt11: Bolt11String): Promise<DecodedBolt11> {
      return get("ln_decodebolt11", bolt11);
    }
  };
  return api;
};
