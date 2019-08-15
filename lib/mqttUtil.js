"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const mqtt_1 = __importDefault(require("mqtt"));
/**
 * Connect to and lsn to cypher node mqtt events
 * @requires must be run on cypher node network in docker
 */
const cypherNodeMqttSub = ({ host = process.env.CYPHERNODE_MQTT_BROKER || "localhost", port = 1883, mqttClient = mqtt_1.default.connect({
    host,
    protocol: "mqtt",
    clientId: "cn-sdk-" + Math.floor(Math.random() * 100),
    port
}), emitter = new events_1.EventEmitter() } = {}) => {
    const subPromise = new Promise((res, rej) => mqttClient.on("connect", () => {
        mqttClient.subscribe("#", e => {
            return e ? rej(e) : res();
        });
    }));
    const cypherNodeMqttMsgParser = (message) => {
        let msg;
        // Cyphernodde sometimes sends invalid JSON
        //ex: {"curl_code":6,"http_code":000,"body":""
        try {
            msg = JSON.parse(message.toString());
        }
        catch (err) {
            return;
        }
        const decodedBody = Buffer.from(msg.body, "base64").toString("utf8");
        // Check the body
        let parsedBody;
        try {
            parsedBody = JSON.parse(decodedBody);
        }
        catch (err) {
            return;
        }
        return parsedBody;
    };
    /**
     * Setup re-emitter for events
     */
    const msgEmitterLsner = (topic, message) => {
        const parsedBody = cypherNodeMqttMsgParser(message);
        if (!parsedBody)
            return;
        const { id } = parsedBody;
        emitter.emit(`cn-${id}`, parsedBody);
    };
    mqttClient.on("message", msgEmitterLsner);
    /**
     *	Registers an event id
     *	Returns a promise you can await till the event is resolved
     */
    const watchEvent = async (eventId) => {
        await subPromise;
        return new Promise((res, rej) => {
            const msgLsner = (topic, message) => {
                const parsedBody = cypherNodeMqttMsgParser(message);
                if (!parsedBody)
                    return;
                const { id } = parsedBody;
                if (id === eventId) {
                    mqttClient.removeListener("message", msgLsner);
                    res(parsedBody);
                }
            };
            mqttClient.on("message", msgLsner);
        });
    };
    return { watchEvent, emitter };
};
exports.cypherNodeMqttSub = cypherNodeMqttSub;
