import { serial, TestInterface } from "ava";
import { client as btcClient } from "../btcClient";
import { CypherNodeBtcClient, AddressType } from "../lib/types/btc.d";
import mqtt from "mqtt";
import sinon from "sinon";
const MQTT_BROKER = "localhost" || process.env.CYPHERNODE_MQTT_BROKER;
const test = serial as TestInterface<CypherNodeBtcClient & { chain: string }>;
test.before(async t => {
  const client = btcClient({
    apiKey: process.env.CYPHERNODE_API_KEY,
    userType: 3
  });
  // check which chain we're on
  const { chain } = await client.getBlockChainInfo();
  if (!chain) throw "Could not get blockChainInfo or undefined chain type";
  if (chain !== "test") {
    throw "**** WARNING: RUNNING TESTS ON MAINNET!!! ****, switch to testnet for notifier tests";
  }
  const balance = await client.getBalance();
  if (balance <= 0) throw "We have no balance to run spend/watch tests";
  t.context = { ...client, chain };
});
/**
BTC tests
*/

test("Should be able to watch an address and get notificaitons", async t => {
  const { watch, getNewAddress, spend } = t.context;
  const mqttClient = mqtt.connect(MQTT_BROKER);
  const messageProcesor = sinon.stub();
  await new Promise((res, rej) => {
    mqttClient.on("connect", () => {
      mqttClient.subscribe("#", err => {
        if (err) rej(err);
        res();
      });
    });
  });
  const messageAckPromise = new Promise((res, rej) => {
    mqttClient.on("message", function(topic, message) {
      const msg = message.toString();
      messageProcesor({ msg, topic });
    });
  });
  const rcvAddress = await getNewAddress("legacy");
  // Do watch here
  const watchEvent = await watch(rcvAddress);
  // Do spend here
  const { hash } = await spend(rcvAddress, 0.00000000001);
  await messageAckPromise;
  t.true(messageProcesor.called);
});
