"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const btcClient_1 = require("../btcClient");
const mqtt_1 = __importDefault(require("mqtt"));
const sinon_1 = __importDefault(require("sinon"));
const MQTT_BROKER = "localhost" || process.env.CYPHERNODE_MQTT_BROKER;
const test = ava_1.serial;
test.before((t) => __awaiter(this, void 0, void 0, function* () {
    const client = btcClient_1.client({
        apiKey: process.env.CYPHERNODE_API_KEY,
        userType: 3
    });
    // check which chain we're on
    const { chain } = yield client.getBlockChainInfo();
    if (!chain)
        throw "Could not get blockChainInfo or undefined chain type";
    if (chain !== "test")
        throw "**** WARNING: RUNNING TESTS ON MAINNET!!! ****, switch to testnet for notifier tests";
    const balance = yield client.getBalance();
    if (balance <= 0)
        throw "We have no balance to run spend/watch tests";
    t.context = Object.assign({}, client, { chain });
}));
/**
BTC tests
*/
test("Should be able to watch an address and get notificaitons", (t) => __awaiter(this, void 0, void 0, function* () {
    const { watch, getNewAddress, spend } = t.context;
    const mqttClient = mqtt_1.default.connect(MQTT_BROKER);
    const messageProcesor = sinon_1.default.stub();
    yield new Promise((res, rej) => {
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
    const rcvAddress = yield getNewAddress("legacy");
    // Do watch here
    const watchEvent = yield watch(rcvAddress);
    // Do spend here
    const { hash } = yield spend(rcvAddress, 0.00000000001);
    yield messageAckPromise;
    t.true(messageProcesor.called);
}));
