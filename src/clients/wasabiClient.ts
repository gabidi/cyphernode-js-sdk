import cypherNodeHTTPTransport from "../transport/cypherNodeHttpTransport";
import { ClientConfig } from "../lib/types/clients";
import {
  WasabiClient,
  Address,
  WasabiGetBalancesPayload,
  WasabiGetTxnsPayload,
  WasabiNewAddressPayload,
  WasabiSpendPayload,
  WasabiGetUnspentCoinsPayload
} from "../lib/types/wasabi.d";

export const client = ({
  transport = cypherNodeHTTPTransport()
}: ClientConfig = {}): WasabiClient => {
  const { get, post } = transport;
  const api = {
    getNewAddress(label: string): Promise<WasabiNewAddressPayload> {
      return post("wasabi_getnewaddress", { label });
    },
    getBalances(anonset?: number): Promise<WasabiGetBalancesPayload> {
      return get("wasabi_getbalances", anonset);
    },
    getUnspentCoins(
      instanceId?: number
    ): Promise<WasabiGetUnspentCoinsPayload> {
      return get("wasabi_getunspentcoins", instanceId);
    },
    getTxns({
      instanceId,
      txnFilterInternal
    }: {
      instanceId?: number;
      txnFilterInternal?: boolean;
    } = {}): Promise<WasabiGetTxnsPayload> {
      return post("wasabi_gettransactions", { instanceId, txnFilterInternal });
    },
    async spend(param: {
      address: Address;
      amount: number;
      instanceId?: number;
      private?: boolean;
      minanonset?: number;
    }): Promise<WasabiSpendPayload> {
      return post("wasabi_spend", param);
    },
    async autoSpendReadyCoins(): Promise<WasabiSpendPayload> {
      return get("wasabi_spendprivate");
    }
  };
  return api;
};
