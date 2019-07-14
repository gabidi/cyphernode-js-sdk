import { serial, TestInterface } from "ava";
import { client as btcClient } from "./btcClient";
import { CypherNodeBtcClient, AddressType } from "./lib/types/btc.d";
const test = serial as TestInterface<CypherNodeBtcClient & { chain: string }>;
test.before(async t => {
  const client = btcClient({
    apiKey: process.env.CYPHERNODE_API_KEY,
    userType: 3
  });
  const { chain } = await client.getBlockChainInfo();
  if (!chain) throw "Could not get blockChaihInfo or undefined chain type";
  if (chain === "main")
    console.warn("**** WARNING: RUNNING TESTS ON MAINNET!!! *****");
  // check which chain we're on
  t.context = { ...client, chain };
});
/**
BTC tests
*/

test("Should be able to get a new legacy, p2sh or bech32 bitcoin address ", async t => {
  const {
    context: { getNewAddress, chain }
  } = t;
  const addressTypes: { AddressType: [string, string] } = {
    legacy: ["1", "2"],
    "p2sh-segwit": ["3", "2"],
    bech32: ["b", "2"]
  };

  await Promise.all(
    Object.entries(addressTypes).map(
      async ([addressType, addressFirstChar]) => {
        const address = await getNewAddress(addressType);
        t.true(address.length >= 33);
        // Test based on what chain we're on
        t.is(address[0].toString(), addressFirstChar[chain === "main" ? 0 : 1]);
      }
    )
  );
});
test("Should be able to get the latest block's hash", async t => {
  const {
    context: { getBestBlockHash }
  } = t;
  const blockHash = await getBestBlockHash();
  t.is(blockHash.length, 64);
});
test("Should be able to get the lastest block's info", async t => {
  const {
    context: { getBestBlockInfo }
  } = t;
  const blockInfo = await getBestBlockInfo();
  t.true(!!blockInfo.hash.length);
  t.true(!isNaN(blockInfo.height));
  t.true(!isNaN(blockInfo.time));
  t.true(!!blockInfo.tx.length);
});
test("Should be able to get the any block's info", async t => {
  const {
    context: { getBlockInfo, chain }
  } = t;
  if (chain === "test") return;
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
    context: { getTxn, chain }
  } = t;
  if (chain === "test") return;
  const txnId =
    "356a61085702ef1b89c8027a4169b124f09e157577494ea6dcfe81cb5065aaba ";
  const txnInfo = await getTxn(txnId);
  t.true(!!txnInfo.txid.length);
  t.true(txnInfo.confirmations > 1);
  t.true(txnInfo.time > 1);
  t.true(txnInfo.blocktime > 1);
});

test("Should be able to get a wallets balance", async t => {
  const {
    context: { getBalance }
  } = t;
  const balance = await getBalance();
  t.false(isNaN(balance));
});
