import { serial, TestInterface } from "ava";
import { client as btcClient } from "../clients/btcClient";
import { CypherNodeBtcClient, AddressType } from "../lib/types/btc.d";
import { until } from "async";
import mqtt from "mqtt";
import sinon from "sinon";
import { EventEmitter } from "events";
const MQTT_BROKER = process.env.CYPHERNODE_MQTT_BROKER || "localhost";
const test = serial as TestInterface<CypherNodeBtcClient & { chain: string }>;
test.before(async t => {
  const client = btcClient({
    apiKey: process.env.CYPHERNODE_API_KEY,
    userType: 3
  });
  // check which chain we're on
  const { chain } = await client.getBlockChainInfo();
  if (!chain) throw "Could not get blockChainInfo or undefined chain type";
  t.context = { ...client, chain };
});

test.skip("Should be able to watch an address and get notificaitons", async t => {
  const { watchAddress, getNewAddress, spend, chain, getBalance } = t.context;
  if (chain !== "test") {
    throw "**** WARNING: RUNNING TESTS ON MAINNET!!! ****, switch to testnet for notifier tests";
  }
  const balance = await getBalance();
  if (balance <= 0) throw "We have no balance to run spend/watch tests";
  const mqttClient = mqtt.connect({
    host: MQTT_BROKER,
    protocolId: "MQTT",
    port: 1883
  });
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
  // Do watchAddress here
  const watchEvent = await watchAddress(rcvAddress);
  // Do spend here
  const { hash } = await spend(rcvAddress, 0.00000000001);
  await messageAckPromise;
  t.true(messageProcesor.called);
});
