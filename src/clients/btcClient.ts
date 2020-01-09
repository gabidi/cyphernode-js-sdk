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
  GenericWatchResponse,
  WatcherOptions,
  Pub32WatcherOptions,
  Pub32AddressWatchPayload,
  Pub32WatchConfirmation,
  WatchPub32UnusedAddress,
  WatchedPub32,
  WatchPub32Txn,
  BlockChainInfo,
  SpendConfirmation,
  SpenderGetTxnResult
} from "../lib/types/btc.d";
export const client = ({
  transport = cypherNodeHTTPTransport()
}: ClientConfig = {}): CypherNodeBtcClient => {
  const { get, post } = transport;
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
    async getTxnsSpending(
      count = 10,
      skip = 0
    ): Promise<[SpenderGetTxnResult]> {
      const { txns } = await get("get_txns_spending", [count, skip].join("/"));
      return txns;
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
    ): Promise<Pub32WatchConfirmation> {
      if (!options.label) throw "Label is required to for a pub32 watch";
      if (/[^0-9a-zA-Z_i ]/.test(options.label))
        throw "Labels must be alpha numeric or _";
      const result = await post("watchxpub", {
        pub32: xpub,
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
    async unwatchPub32ByLabel(label: string): Promise<GenericWatchResponse> {
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
    },
    async getUnusedAddressesByPub32Label(
      label: string,
      count = 10
    ): Promise<[WatchPub32UnusedAddress]> {
      const { label_unused_addresses } = await get(
        "get_unused_addresses_by_watchlabel",
        [label, count].join("/")
      );
      return label_unused_addresses;
    },
    async getTransactionsByPub32Label(
      label: string,
      count = 10
    ): Promise<[WatchPub32Txn]> {
      const { label_txns } = await get(
        "get_txns_by_watchlabel",
        [label, count].join("/")
      );
      return label_txns;
    }
  };
  return api;
};
