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
  XPub,
  AddressEvent
} from "./lib/types/btc.d";
export const client = ({
  apiKey = undefined,
  userType = undefined,
  client = cypherNodeClient({ apiKey, userType })
}: ClientConfig = {}): CypherNodeBtcClient => {
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
