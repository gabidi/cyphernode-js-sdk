import cypherNodeClient from "./lib/cypherNodeClient";
import {
  CypherNodeClient,
  CypherNodeClientParam,
  ClientConfig
} from "./lib/types/clients";
import {
  CypherNodeBtcClient,
  Hash,
  BlockInfo,
  TxnInfo,
  Address,
  AddressType,
  XPub,
  AddressEvent,
  BlockChainInfo
} from "./lib/types/btc.d";
export const client = ({
  apiKey = undefined,
  userType = undefined,
  token = undefined,
  cypherGateway = undefined,
  client = cypherNodeClient({ token, apiKey, userType, cypherGateway })
}: ClientConfig = {}): CypherNodeBtcClient => {
  const { get, post } = client;
  const api = {
    getBlockChainInfo(): Promise<BlockChainInfo> {
      return get("getblockchaininfo");
    },
    async getNewAddress(type: AddressType = "p2sh-segwit"): Promise<Address> {
      const { address } = await get("getnewaddress", type);
      return address;
    },
    async getBestBlockHash(): Promise<Hash> {
      const { result: blockHash } = await get("getbestblockhash");
      return blockHash;
    },
    async getBestBlockInfo(): Promise<BlockInfo> {
      const { result: blockInfo } = await get("getbestblockinfo");
      return blockInfo;
    },
    async getBlockInfo(blockHash: Hash): Promise<BlockInfo> {
      const { result: blockInfo } = await get("getblockinfo", blockHash);
      return blockInfo;
    },
    async getTxn(txnHash: Hash): Promise<TxnInfo> {
      const { result: txnInfo } = await get("gettransaction", txnHash);
      return txnInfo;
    },
    async getBalance(): Promise<number> {
      const { balance } = await get("getbalance");
      return balance;
    },
    async watch(address: XPub | Address): Promise<AddressEvent> {
      const result = await post("watch", {
        address,
        unconfirmedCallbackURL: "",
        confirmedCallbackURL: ""
      });
      return result;
    },
    async unwatch(address: XPub | Address): Promise<AddressEvent> {
      const result = await post("unwatch", {
        address
      });
      return result;
    }
  };
  return api;
};
