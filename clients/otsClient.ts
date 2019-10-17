import cypherNodeHTTPTransport from "../transport/cypherNodeHttpTransport";
import {
  CypherNodeClient,
  CypherNodeClientParam,
  ClientConfig
} from "../lib/types/clients";
import { CypherNodeOTSClient, Hash, OTSStampRcpt } from "../lib/types/ots";
export const client = ({
  transport =cypherNodeHTTPTransport()
}: ClientConfig = {}): CypherNodeOTSClient => {
  const { get, post } = transport;
  const api = {
    async stamp(fileHash: Hash): Promise<OTSStampRcpt> {
      const stampRct = await post("ots_stamp", { hash: fileHash });
      return stampRct;
    },
    async getStamp(fileHash: Hash) {
      const poop = await get("ots_getfile", fileHash);
      return poop;
    }
  };
  return api;
};
