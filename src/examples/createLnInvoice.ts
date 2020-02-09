/**
 * This example will fetch all your watched Pub32 from Cyphernode and their balances , and then print them out in a simple console output
 */
import { client } from "../clients/lncClient";
(async () => {
  try {
    const { createInvoice } = client();
    const invoice = await createInvoice({
      label: "My CN inovice",
      description: "An invoice",
      expiry: Date.now() + 60 * 60 * 1000,
      callback_url: null,
      msatoshi: 0
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }

  console.log("invoice", invoice);
})();
