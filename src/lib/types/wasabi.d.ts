export type Hash = string; // '0000000000000000001c6a6ae90f3f90f9a02098f5f447dc3ee09649097fa2cf'
export type BlockHash = Hash;
export type BlockHeight = number;
export type MerkleRoot = Hash;
export type TxnHash = Hash;
export type TimeStamp = number;
export type TxnHex = string;
export type TxnId = string;
export type Address = string;
export type AddressType = "bech32" | "legacy" | "p2sh-segwit" | "expub";
export interface WasabiNewAddressPayload {
  address: Address;
  keyPath: string; //"84'/0'/0'/0/23";
  label: string; //'["unknown"]';
}
export interface WasabiGetBalancesPayload {
  [instanceId: string]: { private: number; total: number };
}
export interface WasabiTxn {
  datetime: string; // "2020-04-23T18:10:36+00:00";
  height: number; //1721643;
  amount: number; // 340000;
  label: string; // "mytest";
  tx: string; // "220850ec4d8a8daf6ebe9e74f4ab29ffca3392ff03a081c4915a83cb56b9e0e5";
}
export interface WasabiGetTxnsPayload {
  instanceId: number | null;
  transactions: [WasabiTxn];
}
export interface WasabiUnspentCoint {
  txid: string; //"d914f27248354d5f1886ebf393f2a2ba9fd56a0c67e864cf5e549cdade8b351f";
  index: number; // 0;
  amount: number; //15815;
  anonymitySet: number; // 9;
  confirmed: boolean; // true;
  label: string; // "";
  keyPath: string; // "84'/0'/0'/1/1892";
  address: string; //  "tb1qlvxadhum3k5nthv8g9nkhze43sk9v727jnhkxj";
}
export interface WasabiGetUnspentCoinsPayload {
  instanceId: number | null;
  transactions: [WasabiUnspentCoint];
}
export interface WasabiSpendPayload {
  txid: string;
  tx: string;
}

export interface WasabiClient {
  getNewAddress(label: string): Promise<WasabiNewAddressPayload>;
  getBalances(): Promise<WasabiGetBalancesPayload>;
  getTxns(instanceId: number): Promise<WasabiGetTxnsPayload>;
  getUnspentCoins(instanceId?: number): Promise<WasabiGetUnspentCoinsPayload>;
  spend(param: {
    instanceId?: number;
    private?: boolean;
    address: Address;
    amount: number;
  }): Promise<WasabiSpendPayload>;
}
