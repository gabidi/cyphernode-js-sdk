import cypherNodeHTTPTransport from "../transport/cypherNodeHttpTransport";
import { ClientConfig } from "../lib/types/clients";
import {
  ConnectionString,
  LnNodeInfo,
  CreatedInvoice,
  CreateInvoicePayload,
  LnAddress,
  Bolt11String,
  DecodedBolt11,
  CypherNodeLncClient,
  LnConnectAndFundPayload,
  LnConnectAndFundResult,
  LnListPeersPayload,
  LnPayBolt11Payload,
  LnRouteDetails,
  LnListFundsPayload,
  LnListPaysPayload
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
    openAndFundPeerChannel(
      payload: LnConnectAndFundPayload
    ): Promise<LnConnectAndFundResult> {
      return post("ln_connectfund", payload);
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
    },
    async getRoute(
      nodeId: string,
      amount: number,
      riskFactor = 0
    ): Promise<[LnRouteDetails]> {
      const { route } = await get(
        "ln_getroute",
        [nodeId, amount, riskFactor].join("/")
      );
      return route;
    },
    async listPeers(nodeId?: string): Promise<[LnListPeersPayload]> {
      const { peers } = await get("ln_listpeers", nodeId);
      return peers;
    },
    listFunds(): Promise<LnListFundsPayload> {
      return get("ln_listfunds");
    },
    async listPays(): Promise<[LnListPaysPayload]> {
      const { pays } = await get("ln_listpays");
      return pays;
    },
    async payBolt11(
      bolt11: string,
      expectedMsatoshi?: number,
      expectedDesc?: string
    ): Promise<LnPayBolt11Payload> {
      const payresult = await post("ln_pay", {
        bolt11,
        expected_msatoshi: expectedMsatoshi ? expectedMsatoshi : undefined,
        expected_description: expectedDesc ? expectedDesc : undefined
      });
      return payresult;
    },
    withdrawFunds(
      destination: string,
      satoshi: number,
      feerate: string = "normal"
    ): Promise<any> {
      return post("ln_withdraw", {
        destination,
        satoshi,
        feerate
      });
    }
  };
  return api;
};
