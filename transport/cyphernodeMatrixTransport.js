"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("async");
const v4_1 = __importDefault(require("uuid/v4"));
const debug_1 = __importDefault(require("debug"));
const events_1 = require("events");
const matrixUtil_1 = require("../lib/matrixUtil");
const debug = debug_1.default("cypherNodeMatrixTransport");
const cypherNodeMatrixTransport = async ({ baseUrl = undefined, user = undefined, password = undefined, roomId = undefined, matrixClient = matrixUtil_1.getSyncMatrixClient({ baseUrl, user, password }), emitter = new events_1.EventEmitter() } = {}) => {
    const transportRoom = await matrixClient.joinRoom(roomId);
    debug("Transport in room", transportRoom.roomId);
    // Setup room lsner, re-emits room commands as nonce events on emitter:w
    matrixClient.on("Room.timeline", function (event, room, toStartOfTimeline) {
        // we know we only want to respond to messages
        if (event.getType() !== "m.room.cypherNodeCommand")
            return;
        // we are only intested in messages for our room
        if (event.getRoomId() === transportRoom.roomId) {
            const { body, msgtype } = event.getContent();
            // Make sure this is reply not echo
            if (msgtype !== "m.commandReply")
                return;
            const { nonce, reply } = JSON.parse(body);
            emitter.emit(nonce, { ...reply });
        }
    });
    // Serialize command sending on matrix
    const _commandQueue = async_1.queue(async ({ method, command, param, nonce }) => {
        debug("Transport::Command queue sending", method, command, nonce);
        await matrixClient.sendEvent(roomId, "m.room.cypherNodeCommand", {
            body: JSON.stringify({ method, command, param, nonce }),
            msgtype: "m.commandRequest"
        }, "");
    }, 1);
    // Sends uuids the comand  and sends it to queue
    // @return a promise that fullfills with commands reply (when emitter emits nonce)
    const _sendCommand = ({ method, command, payload }) => {
        const nonce = v4_1.default();
        const commandPromise = new Promise((res, rej) => {
            const timeOut = setTimeout(() => {
                rej({
                    err: `Message ${nonce.slice(0, 4)}-${nonce.slice(-4)} ${method}:${command} timedout`
                });
            }, 30000);
            emitter.once(nonce, ({ err, ...data }) => {
                clearTimeout(timeOut);
                err ? rej({ err }) : res(data);
            });
        });
        _commandQueue.push({
            method,
            command,
            param: payload,
            nonce
        });
        return commandPromise;
    };
    const get = (command, payload) => _sendCommand({ method: "GET", command, param: payload });
    const post = (command, payload) => _sendCommand({ method: "POST", command, param: payload });
    return { get, post };
};
exports.cypherNodeMatrixTransport = cypherNodeMatrixTransport;
