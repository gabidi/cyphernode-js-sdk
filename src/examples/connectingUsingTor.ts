/**
 * A simple example showing how easy it is to connect to your Cyphernode behind a proxy (Ex. Tor) using the SDK
 * by simply injecting the proxied transport into the client of your choice
 */
import { client as btcClient } from "../clients/btcClient";
import httpTransport from "../transport/cypherNodeHttpTransport";
import https from "https";
import url from "url";
(async () => {
  try {
    // Setup the transport proxyUrl
    const transport = httpTransport({
      proxyUrl: "socks://127.0.0.1:9050",
      gatewayUrl:
        // Change this to match your cyphernode onion
        "https://CHANGE_ME.onion:2010/v0/"
    });
    // Inject the transport the btcclient (or whatever client you want to instantiate)
    const client = btcClient({ transport });
    const bestBlockInfo = await client.getBestBlockInfo();
    console.log(
      "I got the best block info through a socks proxy !",
      bestBlockInfo
    );
  } catch (err) {
    console.error("I pooped", err);
  }
})();
