import { TimeStamp, BlockHeight } from "./btc.d";

export type TimeStamp = TimeStamp;
export type Hash = string;

export interface OTSStampRcpt {
  method: string; // "ots_stamp";
  hash: Hash; // "01e0cdf7cfea1d26869a89ab8dd79571d53e9d2273a11133be05f566e714a400";
  id: number; // "3";
  result: string; //"success";
}

export interface CypherNodeOTSClient {
  stamp(fileHash: Hash): Promise<OTSStampRcpt>;
  getStamp(fileHash: Hash): Promise<any>;
}
