"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const btcClient_1 = require("../clients/btcClient");
const mqttUtil_1 = require("../lib/mqttUtil");
const async_1 = require("async");
const mqtt_1 = __importDefault(require("mqtt"));
const sinon_1 = __importDefault(require("sinon"));
const MQTT_BROKER = process.env.CYPHERNODE_MQTT_BROKER || "localhost";
const test = ava_1.serial;
test.before(async (t) => {
    const client = btcClient_1.client({
        apiKey: process.env.CYPHERNODE_API_KEY,
        userType: 3
    });
    // check which chain we're on
    const { chain } = await client.getBlockChainInfo();
    if (!chain)
        throw "Could not get blockChainInfo or undefined chain type";
    t.context = { ...client, chain };
});
test("Mqtt async await interface - Should be able to get a pending transaction from latest block and await it", async (t) => {
    const { getBestBlockInfo, getTxn, watchTxnId } = t.context;
    const { tx } = await getBestBlockInfo();
    // Find a txn with less than 2 confirmation in last block
    let index = 0;
    let txn;
    const { txid: txnIdToWatch } = await async_1.until(cb => {
        cb(null, index === 0 ? false : txn.confirmations <= 2);
    }, async () => {
        const t = await getTxn(tx[index]);
        index += 1;
        txn = t;
        return t;
    });
    t.true(!!txnIdToWatch.length);
    const watchConfirmation = await watchTxnId(txnIdToWatch, { nbxconf: 2 });
    const { id: watchEventId } = watchConfirmation;
    t.false(isNaN(watchEventId));
    // Inject custom broker for test
    const mqttClient = mqtt_1.default.connect({
        host: MQTT_BROKER,
        protocol: "mqtt",
        rejectUnauthorized: false,
        clientId: "ava_" + Math.floor(Math.random() * 100),
        port: 1883
    });
    const { watchEvent } = mqttUtil_1.cypherNodeMqttSub({ mqttClient });
    const { id, txid, confirmations } = await watchEvent(watchEventId);
    t.is(id, watchEventId);
    t.is(txid, txnIdToWatch);
    t.true(parseInt(confirmations) >= 2);
});
test("Mqtt event interface - Should be able to get a pending transaction from latest block listen to the event emitter", async (t) => {
    const { getBestBlockInfo, getTxn, watchTxnId } = t.context;
    const { tx } = await getBestBlockInfo();
    // Find a txn with less than 2 confirmation in last block
    let index = 0;
    let txn;
    const { txid: txnIdToWatch } = await async_1.until(cb => {
        cb(null, index === 0 ? false : txn.confirmations <= 2);
    }, async () => {
        const t = await getTxn(tx[index]);
        index += 1;
        txn = t;
        return t;
    });
    t.true(!!txnIdToWatch.length);
    const watchConfirmation = await watchTxnId(txnIdToWatch, { nbxconf: 2 });
    const { id: watchEventId } = watchConfirmation;
    t.false(isNaN(watchEventId));
    // Inject custom broker for test
    const mqttClient = mqtt_1.default.connect({
        host: MQTT_BROKER,
        protocol: "mqtt",
        rejectUnauthorized: false,
        clientId: "ava_" + Math.floor(Math.random() * 100),
        port: 1883
    });
    const { emitter } = mqttUtil_1.cypherNodeMqttSub({ mqttClient });
    const { id, txid, confirmations } = await new Promise((res, rej) => {
        emitter.on(`cn-${watchEventId}`, res);
    });
    t.is(id, watchEventId);
    t.is(txid, txnIdToWatch);
    t.true(parseInt(confirmations) >= 2);
});
test.skip("Should be able to watch an address and get notificaitons", async (t) => {
    const { watchAddress, getNewAddress, spend, chain, getBalance } = t.context;
    if (chain !== "test") {
        throw "**** WARNING: RUNNING TESTS ON MAINNET!!! ****, switch to testnet for notifier tests";
    }
    const balance = await getBalance();
    if (balance <= 0)
        throw "We have no balance to run spend/watch tests";
    const mqttClient = mqtt_1.default.connect({
        host: MQTT_BROKER,
        protocolId: "MQTT",
        port: 1883
    });
    const messageProcesor = sinon_1.default.stub();
    await new Promise((res, rej) => {
        mqttClient.on("connect", () => {
            mqttClient.subscribe("#", err => {
                if (err)
                    rej(err);
                res();
            });
        });
    });
    const messageAckPromise = new Promise((res, rej) => {
        mqttClient.on("message", function (topic, message) {
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
