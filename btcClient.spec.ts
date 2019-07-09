import { serial, TestInterface } from "ava";
import btcClient from "./btcClient";
import { CypherNodeBtcClient } from "./lib/types/btc.d";
const test = serial as TestInterface<CypherNodeBtcClient>;
test.before(t => {
  t.context = {
    ...btcClient({
      apiKey:
        process.env.CYPHERNODE_API_KEY ||
        "5b5d6ff9027dc1fdce9e84645329a194d79f346b3c7a5338d9610139c1fbd2e8",
      userType: 3
    })
  };
});
/**
BTC tests
*/

test("Should be able to get a new bitcoin address", async t => {
  const {
    context: { getNewAddress }
  } = t;
  const address = await getNewAddress();
  t.is(address.length, 34);
  t.is(address[0], "3");
});
test("Should be able to get the latest block's hash", async t => {
  const {
    context: { getBestBlockHash }
  } = t;
  const blockHash = await getBestBlockHash();
  t.is(blockHash.length, 64);
});
test("Should be able to get the latest block's info", async t => {
  const {
    context: { getBlockInfo }
  } = t;
  const blockHash =
    "0000000000000000001c6a6ae90f3f90f9a02098f5f447dc3ee09649097fa2cf";
  const blockInfo = await getBlockInfo(blockHash);
  t.true(!!blockInfo.hash.length);
  t.true(!isNaN(blockInfo.height));
  t.true(!isNaN(blockInfo.time));
  t.true(!!blockInfo.tx.length);
});

test("Should be able to get a transactions info", async t => {
  const {
    context: { getTxn }
  } = t;
  const txnId =
    "356a61085702ef1b89c8027a4169b124f09e157577494ea6dcfe81cb5065aaba ";
  const txnInfo = await getTxn(txnId);
  t.true(!!txnInfo.txid.length);
  t.true(txnInfo.confirmations > 1);
  t.true(txnInfo.time > 1);
  t.true(txnInfo.blocktime > 1);
});
