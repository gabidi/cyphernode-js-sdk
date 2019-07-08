import cypherNodeClient from "./lib/cypherNodeClient";
import {
  CypherNodeClient,
  CypherNodeClientParam,
  ClientConfig
} from "./lib/types/clients";
import { Hash, BlockInfo, TxnInfo, Address } from "./lib/types/btc.d";
export default ({
  apiKey = undefined,
  userType = undefined,
  client = cypherNodeClient({ apiKey, userType })
}: ClientConfig = {}) => {
  const { get, post } = client;
  const api = {
    async getNewAddress(): Promise<Address> {
      const { address } = await get("getnewaddress");
      return address;
    },
    async getBestBlockHash(): Promise<Hash> {
      const { result: blockHash } = await get("getbestblockhash");
      return blockHash;
    },
    async getBlockInfo(blockHash: Hash): Promise<BlockInfo> {
      const { result: blockInfo } = await get("getblockinfo", blockHash);
      return blockInfo;
    },
    async getTxn(txnHash: Hash): Promise<TxnInfo> {
      const { result: txnInfo } = await get("gettransaction", txnHash);
      return txnInfo;
    }
  };
  return api;
};
