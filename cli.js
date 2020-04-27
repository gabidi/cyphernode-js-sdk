const { client: lnclient } = require("./src/clients/lncClient");
const { client: btclient } = require("./src/clients/btcClient");
const { client: wasabiClient } = require("./src/clients/wasabiClient");

const ln = lnclient();
const btc = btclient();
const wasabi = wasabiClient();
const { log, error } = console;

module.exports = { ln, btc, wasabi };
