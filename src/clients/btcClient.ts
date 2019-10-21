import cypherNodeHTTPTransport from "../transport/cypherNodeHttpTransport";
import { ClientConfig } from "../lib/types/clients";
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
  WatcherOptions,
  Pub32WatcherOptions,
  Pub32AddressWatchPayload,
  WatchedPub32,
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
    /** Core and Spending */
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
    /** Txn and Address watch & unwatch */
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
    async watchAddress(
      address: Address,
      options?: WatcherOptions
    ): Promise<AddressWatchConfirmation> {
      const result = await post("watch", {
        address,
        ...options
      });
      return result;
    },
    async getActiveAddressWatch(): Promise<[AddressWatchPayload]> {
      const { watches } = await get("getactivewatches");
      return watches;
    },
    async unwatchAddress(address: Address): Promise<AddressWatchConfirmation> {
      const result = await get("unwatch", address);
      return result;
    },
    /** Pub32 watch & unwatch */
    async watchPub32(
      xpub: string,
      options: Pub32WatcherOptions
    ): Promise<AddressWatchConfirmation> {
      const result = await post("watchxpub", {
        xpub,
        ...options
      });
      return result;
    },
    async getWatchedAddressesByPub32(
      xpub: string
    ): Promise<[Pub32AddressWatchPayload]> {
      const { watches } = await get("getactivewatchesbyxpub", xpub);
      return watches;
    },
    async getWatchedAddressesByPub32Label(
      label: string
    ): Promise<[Pub32AddressWatchPayload]> {
      const { watches } = await get("getactivewatchesbylabel", label);
      return watches;
    },
    async getWatchedPub32(): Promise<[WatchedPub32]> {
      const { watches } = await get("getactivexpubwatches");
      return watches;
    },
    async unwatchPub32(xpub: string): Promise<AddressWatchConfirmation> {
      const result = await get("unwatchxpubbyxpub", xpub);
      return result;
    },
    async unwatchPub32ByLabel(label: string): Promise<AddressWatchConfirmation> {
      const result = await get("unwatchxpubbylabel", label);
      return result;
    },
    /** Pub32 Balance */
    async getBalanceByPub32(xpub: string): Promise<string> {
      const { balance } = await get("getbalancebyxpub", xpub);
      return balance;
    },
    async getBalanceByPub32Label(label: string): Promise<string> {
      const { balance } = await get("getbalancebyxpublabel", label);
      return balance;
    }
  };
  return api;
};
