/**
 * This example will fetch all your watched Pub32 from Cyphernode and their balances , and then print them out in a simple console output
 */

import { client as btcClient } from "../clients/btcClient";
import {
  CypherNodeBtcClient,
  AddressType,
  Pub32WatcherOptions
} from "../lib/types/btc.d";
(async () => {
  const client = btcClient();
  const watchedPub32 = await client.getWatchedPub32();
  console.log(`You've got ${watchedPub32.length} watched pub32s!`);
  await Promise.all(
    watchedPub32.map(async ({ pub32, label }) => {
      const balance = await client.getBalanceByPub32Label(label);
      console.log(`${label} :: ${pub32} :: ${balance}`);
    })
  );
})();
