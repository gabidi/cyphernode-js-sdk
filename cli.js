const { client: lnclient } = require("./src/clients/lncClient");
const { client: btclient } = require("./src/clients/btcClient");
const { client: wasabi } = require("./src/clients/wasabiClient");

const ln = lnclient();
const btc = btclient();

module.exports = { ln, btc, wasabi: wasabi() };
