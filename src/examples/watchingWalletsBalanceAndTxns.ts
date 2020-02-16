/**
 * This example will fetch all your watched Pub32 from Cyphernode and their balances , and then print them out in a simple console output
 */
import { client as btcClient } from "../clients/btcClient";
(async () => {
  const {
    getWatchedPub32,
    getBalanceByPub32Label,
    getTransactionsByPub32Label,
    getUnusedAddressesByPub32Label,
    unwatchPub32ByLabel,
    getNewAddress,
    getBalance,
    getTxnsSpending
  } = btcClient();
  const watchedPub32 = await getWatchedPub32();
  console.log(`You've got ${watchedPub32.length} watched pub32s!`);
  await Promise.all(
    watchedPub32.map(async ({ pub32, label }) => {
      try {
        const [balance, txns, unused] = await Promise.all([
          getBalanceByPub32Label(label),
          getTransactionsByPub32Label(label),
          getUnusedAddressesByPub32Label(label)
        ]);
        console.log(
          `Label: ${label}
	   Pub32 ${pub32}
	   balance: ${balance}, 
           last unused address: ${unused[0].address}
	   devrivation index ${unused[0].address_pub32_index}
	`
        );
        if (txns && txns.length) {
          console.log(`${label} has ${txns.length} txns`);
          txns.forEach(txn => console.log(txn));
        }
      } catch (err) {
        console.error("Poop", err);
      }
    })
  );
  // Get spending wallet balnce and next address
  // const [address, balance, txns] = await Promise.all([
  const [address, balance, txns] = await Promise.all([
    getNewAddress("bech32"),
    getBalance(),
    getTxnsSpending()
  ]);
  console.log(`
	    Your spending wallet has a balance ${balance}
	    send BTC to : ${address}
	    `);
  if (txns.length) {
    txns.forEach(txn => console.log(txn));
  }
})();
