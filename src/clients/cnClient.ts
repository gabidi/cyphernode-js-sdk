import cypherNodeHTTPTransport from "../transport/cypherNodeHttpTransport";
import { ClientConfig } from "../lib/types/clients";
import { cnClient } from "../lib/types/cnClient.d";

export const client = ({
  transport = cypherNodeHTTPTransport()
}: ClientConfig = {}): cnClient => {
  const { get, post } = transport;
  const api = {
    async getConfigProps(): Promise<
      [{ id: number; property: string; value: number; inserted_ts: string }]
    > {
      const { cyphernode_props } = await get("config_props");
      return cyphernode_props;
    },
    async setConfigProp(property: string, value: string): Promise<string> {
      return await post("config_props", { property, value });
    }
  };
  return api;
};
