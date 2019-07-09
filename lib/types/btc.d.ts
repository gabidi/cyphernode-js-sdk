export type Hash = string; // '0000000000000000001c6a6ae90f3f90f9a02098f5f447dc3ee09649097fa2cf'
export type BlockHash = Hash;
export type BlockHeight = number;
export type MerkleRoot = Hash;
export type TxnHash = Hash;
export type TimeStamp = number;
export type TxnHex = string;
export type TxnId = string;
export type Address = string;
export type TxnOp = string;
// "OP_HASH160 c449a7fafb3b13b2952e064f2c3c58e851bb9430 OP_EQUAL"
// "OP_DUP OP_HASH160 b0379374df5eab8be9a21ee96711712bdb781a95 OP_EQUALVERIFY OP_CHECKSIG"

export interface TxnScriptPubKey {
  asm: string;
  hex: string;
  reqSigs: number;
  type: string;
  addresses: Address;
}
export interface TxnUTXO {
  value: number;
  n: number;
  scriptPubKey: {
    asm: TxnOp;
    hex: TxnHash;
    reqSigs: number;
    type: string;
    addresses: [Address];
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
  difficulty: 7934713219630.606;
  chainwork: "00000000000000000000000000000000000000000703dedf2a137316057ce942";
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
  vin: [TxnUTXO];
  vout: [TxnUTXO];
  hex: TxnHex;
  blockhash: BlockHash;
  confirmations: number;
  time: TimeStamp;
  blocktime: TimeStamp;
}

export interface CypherNodeBtcClient {
    getNewAddress(): Promise<Address> 
    getBestBlockHash(): Promise<Hash> 
    getBlockInfo(blockHash: Hash): Promise<BlockInfo> 
    getTxn(txnHash: Hash): Promise<TxnInfo> 
}
