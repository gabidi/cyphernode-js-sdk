import cypherNodeClient from "./lib/cypherNodeClient";
import {
  CypherNodeClient,
  CypherNodeClientParam,
  ClientConfig
} from "./lib/types/clients";
import { CypherNodeOTSClient, Hash, OTSStampRcpt } from "./lib/types/ots";
export const client = ({
  apiKey = undefined,
  userType = undefined,
  client = cypherNodeClient({ apiKey, userType })
}: ClientConfig = {}): CypherNodeOTSClient => {
  const { get, post } = client;
  const api = {
    async stamp(fileHash: Hash): Promise<OTSStampRcpt> {
      const stampRct = await (<OTSStampRcpt>(
        post("ots_stamp", { hash: fileHash })
      ));
      return stampRct;
    },
    async getStamp(fileHash: Hash) {
      const poop = await get("ots_getfile", fileHash);
      return poop;
    },
    async updateStamp() {
      const poop = await get("ots_backoffice");
      return poop;
    }
  };
  return api;
};
