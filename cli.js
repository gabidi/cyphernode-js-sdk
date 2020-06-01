const { client: lnclient } = require("./src/clients/lncClient");
const { client: btclient } = require("./src/clients/btcClient");
const { client: wasabiClient } = require("./src/clients/wasabiClient");
const { client: cnClient } = require("./src/clients/cnClient");
const repl = require("repl");

const ln = lnclient();
const btc = btclient();
const wasabi = wasabiClient();
const cn = cnClient();
const { log, error } = console;

const replEvalPromise = (cmd, ctx, filename, cb) => {
  let result = eval(cmd);
  if (result instanceof Promise) {
    return result.then(response => cb(null, response));
  }
  return cb(null, result);
};
repl.start({ prompt: "cyphernode-cli > ", eval: replEvalPromise });
