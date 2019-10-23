import { serial, TestInterface } from "ava";
import { client as btcClient } from "./btcClient";
import {
  CypherNodeBtcClient,
  AddressType,
  Pub32WatcherOptions
} from "../lib/types/btc.d";
const test = serial as TestInterface<CypherNodeBtcClient & { chain: string }>;
test.before(async t => {
  const client = btcClient();
  // check which chain we're on
  const { chain } = await client.getBlockChainInfo();
  if (!chain) throw "Could not get blockChainInfo or undefined chain type";
  if (chain === "main")
    console.warn("**** WARNING: RUNNING TESTS ON MAINNET!!! *****");
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
    legacy: ["1", "m"],
    "p2sh-segwit": ["3", "2"],
    bech32: ["b", "2"]
  };

  await Promise.all(
    Object.entries(addressTypes).map(
      async ([addressType, addressFirstChar]) => {
        const address = await getNewAddress(addressType);
        t.true(address.length >= 33);
        // TODO remove this and fix address prefix for testnet tests
        if (chain === "main")
          t.is(
            address[0].toString(),
            addressFirstChar[chain === "main" ? 0 : 1]
          );
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
test("Should be able to get the a block's hash from its height", async t => {
  const {
    context: { getBlockHash, chain }
  } = t;
  const blockHash = await getBlockHash(593104);
  // testnet blocks can change, so only do actaul verification of blochash on mainnet
  if (chain === "main")
    t.is(
      blockHash,
      "00000000000000000005dc459f0575b17413dbe7685e3e0fd382ed521f1be68b"
    );
  else t.true(!!blockHash.length);
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
  if (chain === "test") {
    t.pass();
    return;
  }
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
  if (chain === "test") {
    t.pass();
    return;
  }
  const txnId =
    "356a61085702ef1b89c8027a4169b124f09e157577494ea6dcfe81cb5065aaba ";
  const txnInfo = await getTxn(txnId);
  t.true(!!txnInfo.txid.length);
  t.true(txnInfo.confirmations > 1);
  t.true(txnInfo.time > 1);
  t.true(txnInfo.blocktime > 1);
});

test("Should be able to get the spending wallets balance", async t => {
  const {
    context: { getBalance }
  } = t;
  const balance = await getBalance();
  t.false(isNaN(balance));
});
test("Should be able to spend (will only run when testnet)", async t => {
  const {
    context: { getBalance, getNewAddress, spend, chain }
  } = t;
  if (chain !== "test") {
    t.pass();
    return;
  }

  const [balance, sendToAddress] = await Promise.all([
    getBalance(),
    getNewAddress()
  ]);
  if (balance <= 0) t.fail("Not enough funds to run spend test");
  const { status, hash } = await spend(sendToAddress, balance / 1000);
  t.is(status, "accepted");
});
/* Watch Pub32 tests */
test("Should be able to get a list of watched Pub32 and their labels", async t => {
  const {
    context: { getWatchedPub32 }
  } = t;
  const watchedPub32 = await getWatchedPub32();
  t.true(Array.isArray(watchedPub32));
  if (watchedPub32.length < 1) t.pass();
  else {
    t.true(
      watchedPub32.every(({ pub32, label }) => pub32.length && label.length)
    );
  }
});
test.skip("Should be able to watch a Ypub", async t => {
  const {
    context: { watchPub32 }
  } = t;
  // FIXME move this to env config and add check before commiting
  const ypub =
    "ypub6XTi8fouZbthcX1PD9uxRunjd69jKZaYJLbiPma1VtrcHZa73X7KzLeMV9GkT3UfyrDp6nAbe4PDiyaxKhN3aJPCTWVz9Fx9s11RDGawTMZ";
  const pub32label = "bb_ai";
  //const ypub =
  // "xpub6CYUKP1jQr257nwDNuYy9htwuyaqr2HL6LFfYLFGkXKzWq3AFrocGLsUdvckSN1GMjfag4G8pFyWdz7wwyt6oJzsLTAbyv2Bd9en9gEenyH";
  // const pub32label = "bb_personal"
  const watchOptions: Pub32WatcherOptions = {
    label: pub32label,
    nstart: 0,
    path: "0/n"
  };
  const { label, pub32, id } = await watchPub32(ypub, watchOptions);
  t.false(isNaN(id));
  t.is(pub32, ypub);
  t.is(label, watchOptions.label);
});
test.skip("Should be able to get watched address for 32pub by labe", async t => {
  const {
    context: { getWatchedAddressesByPub32Label }
  } = t;
  const ypubLabel = "bbAI";
  const watchedAddresses = await getWatchedAddressesByPub32Label(ypubLabel);
  t.true(watchedAddresses.length > 0);
  t.true(watchedAddresses.every(({ address }) => address.length === 34));
});
test("Should be able to get a watched 32pub's balance by label", async t => {
  const {
    context: { getBalanceByPub32Label }
  } = t;
  const ypubLabel = "bb_ai";
  // to fix in cn:
  // Sql lite schema with label as distinct ?
  //
  // line 162 proxy_docker/app/script/walletoperations.sh add quotes around xpub
  // line 164 add .result to jq addresses=$(send_to_xpub_watcher_wallet ${data} | jq ".result | keys" | tr -d '\n ')
  // line 168 remove spaced between 0,99999,address or bsah thinks they're seperate params and not one param (data)
  // line 175  balance= $balance_resp |  jq "[.result[].amount] | add | . * 100000000 | trunc | . / 100000000"
  // change importaddress to accept a rescan argument
  // change xpub watch api end point to:
  // 	-validate label + xpub
  // 	- sanitize stuff (label names)
  // 	- accept rescan param
  const watchedAddresses = await getBalanceByPub32Label(ypubLabel); // FIXME cyphernode sends bad json if balance is non existant
  console.log(watchedAddresses);
});
test.skip("Should be able to unwatch by label", async t => {
  const {
    context: { unwatchPub32ByLabel }
  } = t;
  const ypubLabel = "bb_personal"; // FIXME Cypher node does not sanitize this !
  const watchedAddresses = await unwatchPub32ByLabel(ypubLabel);
  console.log(watchedAddresses);
});
