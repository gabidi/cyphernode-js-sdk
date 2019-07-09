import { TimeStamp } from "./btc.d";

export type TimeStamp = TimeStamp;
export type ConnectionString = string;
export type LnAddress = string;
export type TimeInMilliSeconds = number;
export type CallBackUrl = string;
export type Bolt11String = string;
export type BoltInvoiceStatus = "unpaid" | "paid";
export interface LnNodeInfo {
  id: "02631c53702bba79f7f816423c0e871ec8d72222d15a6e07e6dc90f29ecf848eef";
  alias: "Sifir.io";
  color: "6c40bf";
  num_peers: number;
  num_pending_channels: number;
  num_active_channels: number;
  num_inactive_channels: number;
  address: [{ type: "ipv4"; address: "173.176.11.106"; port: 9735 }];
  binding: [{ type: "ipv4"; address: "0.0.0.0"; port: 9735 }];
  version: "v0.7.0";
  blockheight: 584013;
  network: "bitcoin";
  msatoshi_fees_collected: 0;
  fees_collected_msat: "0msat";
}

export interface CreateInvoicePayload {
  msatoshi: number;
  label: string;
  description: string;
  expiry: TimeInMilliSeconds;
  callback_url: CallBackUrl;
}
export interface CreatedInvoice {
  id: "1";
  label: "koNCcrSvhX3dmyFhW";
  bolt11: Bolt11String;
  connectstring: "03e9782312dd5e9ab08669955bef2a90675fa99b73bf8ceada4634be2e287b7e1b@96.21.227.155:9735";
  callback_url: "null";
  payment_hash: "c6ca9e52649c58079caa0d47d27a810332bb0b4ea9e3c2fd8e9fa16c99407edf";
  msatoshi: number;
  status: BoltInvoiceStatus;
  description: string;
  expires_at: TimeStamp;
}

export interface DecodedBolt11 {
  currency: "bc";
  created_at: TimeStamp;
  expiry: TimeInMilliSeconds;
  payee: "03e9782312dd5e9ab08669955bef2a90675fa99b73bf8ceada4634be2e287b7e1b";
  msatoshi: number;
  amount_msat: "10msat";
  description: string;
  min_final_cltv_expiry: 10;
  payment_hash: "c6ca9e52649c58079caa0d47d27a810332bb0b4ea9e3c2fd8e9fa16c99407edf";
  signature: "3045022100c32b5bfc445313971035cd4797e08ee0d73c041c2cacc69a4771d8d828112bc202202078bdf35f64b164f056aa8da7e0111";
}

export interface CypherNodeLncClient {
  getNodeInfo(): Promise<LnNodeInfo>;
  getConnectionString(): Promise<ConnectionString>;
  getNewAddress(): Promise<LnAddress>;
  createInvoice(invoice: CreateInvoicePayload): Promise<CreatedInvoice>;
  getInvoice(invoiceLabel?: string): Promise<DecodedBolt11[]>;
  decodeBolt(bolt11: Bolt11String): Promise<DecodedBolt11>;
}
