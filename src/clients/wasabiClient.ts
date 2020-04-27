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
    getTxns(instanceId?: number): Promise<WasabiGetTxnsPayload> {
      return get("wasabi_gettransactions", instanceId);
    },
    async spend(param: {
      address: Address;
      amount: number;
      instanceId?: number;
      private?: boolean;
      minanonset?: number;
    }): Promise<WasabiSpendPayload> {
      return post("wasabi_spend", param);
    }
  };
  return api;
};
