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
    const cnOnionUrl = process.env.CYPHER_ONION_URL || "change.me.onion";
    // Setup the transport proxyUrl
    const transport = httpTransport({
      proxyUrl: "socks://127.0.0.1:9050",
      gatewayUrl: cnOnionUrl
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
