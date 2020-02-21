import { TimeStamp, BlockHeight } from "./btc.d";

export type TimeStamp = TimeStamp;
export type ConnectionString = string;
export type LnAddress = string;
export type TimeInMilliSeconds = number;
export type CallBackUrl = string;
export type Bolt11String = string;
export type BoltInvoiceStatus = "unpaid" | "paid";

interface LnNodeNetworkAddress {
  type: string; // ipv4
  address: string; // 173.176.11.106
  port: number; //9735;
}
export interface LnNodeInfo {
  id: string; // "02631c53702bba79f7f816423c0e871ec8d72222d15a6e07e6dc90f29ecf848eef";
  alias: string; //"Sifir.io";
  color: string; // "6c40bf";
  num_peers: number;
  num_pending_channels: number;
  num_active_channels: number;
  num_inactive_channels: number;
  address: [LnNodeNetworkAddress];
  binding: [LnNodeNetworkAddress];
  version: string; //"v0.7.0";
  blockheight: BlockHeight; // 584013;
  network: "bitcoin";
  msatoshi_fees_collected: number;
  fees_collected_msat: string; // "0msat";
}

export interface CreateInvoicePayload {
  msatoshi: number;
  label: string;
  description: string;
  expiry: TimeInMilliSeconds;
  callback_url: CallBackUrl;
}
export interface CreatedInvoice {
  id: string; // "1";
  label: string; //"koNCcrSvhX3dmyFhW";
  bolt11: Bolt11String;
  connectstring: string; // "03e9782312dd5e9ab08669955bef2a90675fa99b73bf8ceada4634be2e287b7e1b@96.21.227.155:9735";
  callback_url: string; // "null";
  payment_hash: string; //"c6ca9e52649c58079caa0d47d27a810332bb0b4ea9e3c2fd8e9fa16c99407edf";
  msatoshi: number;
  status: BoltInvoiceStatus;
  description: string;
  expires_at: TimeStamp;
}

export interface DecodedBolt11 {
  currency: "bc";
  created_at: TimeStamp;
  expiry: TimeInMilliSeconds;
  payee: string;
  msatoshi: number;
  amount_msat: string; // "10msat"
  description: string;
  min_final_cltv_expiry: number;
  payment_hash: string; //"c6ca9e52649c58079caa0d47d27a810332bb0b4ea9e3c2fd8e9fa16c99407edf";
  signature: string; // "3045022100c32b5bfc445313971035cd4797e08ee0d73c041c2cacc69a4771d8d828112bc202202078bdf35f64b164f056aa8da7e0111";
}
export interface LnConnectAndFundPayload {
  peer: string;
  msatoshi: number; // satoshis "100000";
  callbackUrl: string;
}
export interface LnConnectAndFundResult {
  result: "success";
  txid: string;
  channel_id: string;
}

export interface LnListFundsPayload {
  outputs: [
    {
      txid: string;
      output: number;
      value: number;
      amount_msat: string;
      address: string;
      status: "unconfirmed" | "confirmed" | "spent";
    }
  ];
  channels: [
    {
      peer_id: string;
      connected: boolean;
      state: "CHANNELD_NORMAL";
      short_channel_id: string;
      channel_sat: number;
      our_amount_msat: string; //"89096000msat";
      channel_total_sat: number; //100000;
      amount_msat: string; // "100000000msat";
      funding_txid: string; //"ecd9e49835fa7e447257f00c2248479c697c54b7bb736c7356d92eb33d9e8234";
      funding_output: number;
    }
  ];
}
export interface LnListPeersPayload {
  id: string;
  connected: boolean;
  netaddr: [string];
  features: any;
  channels: [LnChannelDetails];
  log: any;
}
export interface LnChannelDetails {
  state: "CHANNELD_NORMAL";
  scratch_txid: string;
  owner: "channeld";
  short_channel_id: string;
  direction: 1;
  channel_id: string;
  funding_txid: string;
  close_to_addr: string;
  close_to: string;
  private: boolean;
  funding_allocation_msat: any;
  funding_msat: any;
  msatoshi_to_us: number;
  to_us_msat: string; //"89096359msat";
  msatoshi_to_us_min: number;
  min_to_us_msat: string; // "9096359msat";
  msatoshi_to_us_max: number;
  max_to_us_msat: string; // "100000000msat";
  msatoshi_total: number;
  total_msat: string; // "100000000msat";
  dust_limit_satoshis: number;
  dust_limit_msat: string; //"546000msat";
  max_htlc_value_in_flight_msat: number;
  max_total_htlc_in_msat: string; //"18446744073709551615msat";
  their_channel_reserve_satoshis: number;
  their_reserve_msat: string; //"1000000msat";
  our_channel_reserve_satoshis: number;
  our_reserve_msat: string; //"1000000msat";
  spendable_msatoshi: number;
  spendable_msat: string; // "83358359msat";
  htlc_minimum_msat: number;
  minimum_htlc_in_msat: string; // "0msat";
  their_to_self_delay: number;
  our_to_self_delay: number;
  max_accepted_htlcs: number;
  status: [
    "CHANNELD_NORMAL:Reconnected, and reestablished.",
    "CHANNELD_NORMAL:Funding transaction locked. Channel announced."
  ];
  in_payments_offered: number;
  in_msatoshi_offered: number;
  in_offered_msat: string; // "80099101msat";
  in_payments_fulfilled: number;
  in_msatoshi_fulfilled: number;
  in_fulfilled_msat: string; //"80000000msat";
  out_payments_offered: number;
  out_msatoshi_offered: number;
  out_offered_msat: string; // "90903641msat";
  out_payments_fulfilled: number;
  out_msatoshi_fulfilled: number;
  out_fulfilled_msat: string; //"90903641msat";
  htlcs: [];
}

export interface LnRouteDetails {
  id: string;
  channel: string; // "617139x1971x0";
  direction: 1 | 0;
  msatoshi: number;
  amount_msat: string;
  delay: number;
  style: any;
}
export interface LnPayBolt11Payload {
  id: number;
  payment_hash: string;
  msatoshi: number;
  msatoshi_sent: number;
  created_at: number;
  status: string;
  payment_preimage: string;
  description: string;
  getroute_tries: number;
  sendpay_tries: number;
  route: [
    {
      id: string;
      channel: string;
      msatoshi: number;
      delay: number;
    }
  ];
  failures: [any];
}

export interface CypherNodeLncClient {
  getNodeInfo(): Promise<LnNodeInfo>;
  getConnectionString(): Promise<ConnectionString>;
  getNewAddress(): Promise<LnAddress>;
  createInvoice(invoice: CreateInvoicePayload): Promise<CreatedInvoice>;
  getInvoice(invoiceLabel?: string): Promise<CreatedInvoice[]>;
  deleteInvoice(invoiceLabel?: string): Promise<CreatedInvoice>;
  decodeBolt(bolt11: Bolt11String): Promise<DecodedBolt11>;
  openAndFundPeerChannel(
    payload: LnConnectAndFundPayload
  ): Promise<LnConnectAndFundResult>;
  listPeers(nodeId?: string): Promise<[LnListPeersPayload]>;
  listFunds(): Promise<LnListFundsPayload>;
  payBolt11(bolt11: string, route?: string): Promise<LnPayBolt11Payload>;
  getRoute(
    nodeId: string,
    amount: number,
    riskFactor?: number | 0
  ): Promise<[LnRouteDetails]>;
  listPeers(nodeId?: string): Promise<[LnListPeersPayload]>;
  listFunds(): Promise<LnListFundsPayload>;
  payBolt11(bolt11: string): Promise<LnPayBolt11Payload>;
}
