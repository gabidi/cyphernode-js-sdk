const { client: lnclient } = require("./src/clients/lncClient");
const { client: btclient } = require("./src/clients/btcClient");
const { client: wasabiClient } = require("./src/clients/wasabiClient");
const repl=require('repl');

const ln = lnclient();
const btc = btclient();
const wasabi = wasabiClient();
const { log, error } = console;

function replEvalPromise(cmd,ctx,filename,cb) {
  let result=eval(cmd);
  if (result instanceof Promise) {
    return result
      .then(response=>cb(null,response));
  }
  return cb(null, result);
}
repl.start({ prompt: 'cyphernode-cli > ', eval: replEvalPromise });

// module.exports = { ln, btc, wasabi };
