import cypherNodeHTTPTransport from "../transport/cypherNodeHttpTransport";
import {
  CypherNodeClient,
  ClientConfig
} from "../lib/types/clients";
import {
  CypherNodeBtcClient,
  Hash,
  BlockInfo,
  TxnInfo,
  TxnWatchConfimation,
  TxnWatchOptions,
  Address,
  AddressType,
  AddressWatchConfirmation,
  AddressWatchPayload,
  AddressWatchOptions,
  BlockChainInfo,
  SpendConfirmation
} from "../lib/types/btc.d";
export const client = ({
  transport = cypherNodeHTTPTransport()
}: ClientConfig = {}): CypherNodeBtcClient => {
  const { get, post } = transport;
  const parseBtcAddressType = (address: Address): AddressType | null => {
    const addressStart = address.substr(0, 4);
    switch (addressStart) {
      case "upub":
      case "zpub":
      case "xpub":
        return "expub";
      default:
        switch (addressStart[0]) {
          case "1":
            return "legacy";
          case "3":
            return "p2sh-segwit";
          case "b":
            return "bech32";
          default:
            return null;
        }
    }
  };
  const api = {
    getBlockChainInfo(): Promise<BlockChainInfo> {
      return get("getblockchaininfo");
    },
    async getNewAddress(type: AddressType = "p2sh-segwit"): Promise<Address> {
      const { address } = await get("getnewaddress", type);
      return address;
    },
    async getBlockHash(height: number): Promise<Hash> {
      const blockHash = await get("getblockhash", height);
      return blockHash;
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
    async spend(address: Address, amount: number): Promise<SpendConfirmation> {
      const result = await post("spend", { address, amount });
      return result;
    },
    //  TODO Get watch list xpub , label, and tesssst
    async watchAddress(
      address: Address,
      options?: AddressWatchOptions
    ): Promise<AddressWatchConfirmation> {
      const command =
        parseBtcAddressType(address) == "expub" ? "watchxpub" : "watch";
      if (command === "watchxpub" && (!options || !options.path))
        throw "Must provide a derivation path for extended public addresss watches";
      const result = await post(command, {
        address,
        ...options
      });
      return result;
    },
    async watchTxnId(
      txn: string,
      options: TxnWatchOptions
    ): Promise<TxnWatchConfimation> {
      let param = {
        nbxconf: 6,
        ...options
      };
      const result = await post("watchtxid", { txid: txn, ...param });
      return result;
    },
    async getActiveAddressWatch(): Promise<[AddressWatchPayload]> {
      const { watches } = await get("getactivewatches");
      return watches;
    },
    async unwatchAddress(address: Address): Promise<AddressWatchConfirmation> {
      const command =
        parseBtcAddressType(address) === "expub"
          ? "unwatchxpubbyxpub"
          : "unwatch";
      const result = await get(command, address);
      return result;
    },
    async unwatchLabel(label: number): Promise<AddressWatchConfirmation> {
      const result = await get("unwatchxpubbylabel", label);
      return result;
    }
  };
  return api;
};
