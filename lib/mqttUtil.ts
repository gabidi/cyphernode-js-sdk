import { EventEmitter } from "events";
import mqtt from "mqtt";
/**
 * Connect to and lsn to cypher node mqtt events
 * @requires must be run on cypher node network in docker
 */
const cypherNodeMqttSub = ({
  host = process.env.CYPHERNODE_MQTT_BROKER || "localhost",
  port = 1883,
  mqttClient = mqtt.connect({
    host,
    protocol: "mqtt",
    clientId: "cn-sdk-" + Math.floor(Math.random() * 100),
    port
  }),
  emitter = new EventEmitter()
} = {}) => {
  const subPromise = new Promise((res, rej) =>
    mqttClient.on("connect", () => {
      mqttClient.subscribe("#", e => {
        return e ? rej(e) : res();
      });
    })
  );
  const cypherNodeMqttMsgParser = (message: Buffer) => {
    let msg;
    // Cyphernodde sometimes sends invalid JSON
    //ex: {"curl_code":6,"http_code":000,"body":""
    try {
      msg = JSON.parse(message.toString());
    } catch (err) {
      return;
    }
    const decodedBody = Buffer.from(msg.body, "base64").toString("utf8");
    // Check the body
    let parsedBody;
    try {
      parsedBody = JSON.parse(decodedBody);
    } catch (err) {
      return;
    }
    return parsedBody;
  };
  /**
   * Setup re-emitter for events
   */
  const msgEmitterLsner = (topic: string, message: Buffer) => {
    const parsedBody = cypherNodeMqttMsgParser(message);
    if (!parsedBody) return;
    const { id } = parsedBody;
    // TODO quick hack to be able to sub to all events or a specific one
    // Maybe use something with wild card support ?
    emitter.emit(`cn-events`, parsedBody);
    emitter.emit(`cn-${id}`, parsedBody);
  };
  mqttClient.on("message", msgEmitterLsner);
  /**
   *	Registers an event id
   *	Returns a promise you can await till the event is resolved
   */
  const watchEvent = async (eventId: number | string) => {
    await subPromise;
    return new Promise((res, rej) => {
      const msgLsner = (topic: string, message: Buffer) => {
        const parsedBody = cypherNodeMqttMsgParser(message);
        if (!parsedBody) return;
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

export { cypherNodeMqttSub };
