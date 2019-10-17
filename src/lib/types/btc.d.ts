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
export type TxnOp = string;
// "OP_HASH160 c449a7fafb3b13b2952e064f2c3c58e851bb9430 OP_EQUAL"
// "OP_DUP OP_HASH160 b0379374df5eab8be9a21ee96711712bdb781a95 OP_EQUALVERIFY OP_CHECKSIG"
export interface VOut {
  value: number;
  n: number;
  scriptPubKey: {
    asm: TxnOp;
    hex: string;
    reqSigs: number;
    type: string;
    addresses: [Address];
  };
}
export interface VIn {
  txid: string;
  vout: number;
  scriptSig: {
    asm: string;
    hex: string;
  };
}
export interface BlockInfo {
  hash: BlockHash;
  confirmations: number;
  strippedsize: number;
  size: number;
  weight: number;
  height: BlockHeight;
  version: number;
  versionHex: string;
  merkleroot: Hash;
  tx: [TxnHash];
  time: TimeStamp;
  mediantime: TimeStamp;
  nonce: number;
  bits: string;
  difficulty: number; // 7934713219630.606;
  chainwork: string; // "00000000000000000000000000000000000000000703dedf2a137316057ce942";
  nTx: number;
  previousblockhash: BlockHash;
  nextblockhash: BlockHash;
}
export interface TxnInfo {
  txid: TxnId;
  hash: TxnHash;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: [VIn];
  vout: [VOut];
  hex: TxnHex;
  blockhash: BlockHash;
  confirmations: number;
  time: TimeStamp;
  blocktime: TimeStamp;
}
interface WatchConfirmation {
  id: number; // "291";
  event: string; //"watch";
  inserted: number; //  "1";
  unconfirmedCallbackURL: string; // "192.168.133.233:1111/callback0conf";
  confirmedCallbackURL: string; //"192.168.133.233:1111/callback1conf";
}
export interface AddressWatchConfirmation extends WatchConfirmation {
  event: "watch"; //"watch";
  imported: number; //  "1";
  address: Address;
  estimatesmartfee2blocks: number; // "0.000010";
  estimatesmartfee6blocks: number; // "0.000010";
  estimatesmartfee36blocks: number; // "0.000010";
  estimatesmartfee144blocks: number; // "0.000010";
}
export interface TxnWatchConfimation extends WatchConfirmation {
  event: "watchtxid";
  txnId: string;
  nbxconf: number;
}
export interface SpendConfirmation {
  status: string;
  hash: Hash;
}
export interface BlockChainSoftFork {
  id: "bip34";
  version: 2;
  reject: {
    status: boolean;
  };
}
export interface BlockChainInfo {
  chain: "test" | "main";
  blocks: number;
  headers: number;
  bestblockhash: string; //"000000000000002fb99d683e64bbfc2b7ad16f9a425cf7be77b481fb1afa363b";
  difficulty: number; //13971064.71015782;
  mediantime: number; //1554149114;
  verificationprogress: number; //0.9999994536561675;
  initialblockdownload: boolean; //false;
  chainwork: string; //"000000000000000000000000000000000000000000000103ceb57a5896f347ce";
  size_on_disk: number; // 23647567017;
  pruned: boolean;
  softforks: [BlockChainSoftFork];
  bip9_softforks: {
    csv: {
      status: "active";
      startTime: 1456790400;
      timeout: 1493596800;
      since: 770112;
    };
    segwit: {
      status: "active";
      startTime: 1462060800;
      timeout: 1493596800;
      since: 834624;
    };
  };
  warnings: "Warning: unknown new rules activated (versionbit 28)";
}
interface WatcherOptions {
  unconfirmedCallbackURL?: string;
  confirmedCallbackURL?: string;
}

export interface AddressWatchOptions extends WatcherOptions {
  path?: string;
}
export interface TxnWatchOptions extends WatcherOptions {
  nbxconf: number;
}
export interface AddressWatchPayload {
  id: number; //"291";
  address: Address; //"2N8DcqzfkYi8CkYzvNNS5amoq3SbAcQNXKp";
  imported: number; // "1";
  unconfirmedCallbackURL: string; // "192.168.133.233:1111/callback0conf";
  confirmedCallbackURL: string; //"192.168.133.233:1111/callback1conf";
  watching_since: string; // "2018-09-06 21:14:03";
}
export interface CypherNodeBtcClient {
  getBlockChainInfo(): Promise<BlockChainInfo>;
  getNewAddress(addressType: AddressType): Promise<Address>;
  getNewAddress(): Promise<Address>;
  getBlockHash(height: number): Promise<Hash>;
  getBestBlockHash(): Promise<Hash>;
  getBlockInfo(blockHash: Hash): Promise<BlockInfo>;
  getBestBlockInfo(): Promise<BlockInfo>;
  getTxn(txnHash: Hash): Promise<TxnInfo>;
  getBalance(): Promise<number>;
  spend(address: Address, amount: number): Promise<SpendConfirmation>;
  watchAddress(
    address: Address,
    options?: AddressWatchOptions
  ): Promise<AddressWatchConfirmation>;
  watchTxnId(
    txnId: string,
    options: TxnWatchOptions
  ): Promise<TxnWatchConfimation>;
  getActiveAddressWatch(): Promise<[AddressWatchPayload]>;
  unwatchAddress(address: Address): Promise<AddressWatchConfirmation>;
  unwatchLabel(label: number): Promise<AddressWatchConfirmation>;
}
