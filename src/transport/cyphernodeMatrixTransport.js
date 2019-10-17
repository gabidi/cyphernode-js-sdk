var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { queue } from "async";
import uuid from "uuid/v4";
import _debug from "debug";
import { EventEmitter } from "events";
import { getSyncMatrixClient } from "../lib/matrixUtil";
const debug = _debug("cypherNodeMatrixTransport");
const cypherNodeMatrixTransport = ({ roomId = "", client = getSyncMatrixClient(), emitter = new EventEmitter(), } = {}) => __awaiter(this, void 0, void 0, function* () {
    if (!roomId)
        throw "Must provide a room for the transport";
    const matrixClient = yield client;
    const transportRoom = yield matrixClient.joinRoom(roomId);
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
            emitter.emit(nonce, Object.assign({}, reply));
        }
    });
    // Serialize command sending on matrix
    const _commandQueue = queue(({ method, command, param, nonce }) => __awaiter(this, void 0, void 0, function* () {
        debug("Transport::Command queue sending", method, command, nonce);
        yield matrixClient.sendEvent(roomId, "m.room.cypherNodeCommand", {
            body: JSON.stringify({ method, command, param, nonce }),
            msgtype: "m.commandRequest",
        }, "");
    }), 1);
    // Sends uuids the comand  and sends it to queue
    // @return a promise that fullfills with commands reply (when emitter emits nonce)
    const _sendCommand = ({ method, command, payload, }) => {
        const nonce = uuid();
        const commandPromise = new Promise((res, rej) => {
            const timeOut = setTimeout(() => {
                rej({
                    err: `Message ${nonce.slice(0, 4)}-${nonce.slice(-4)} ${method}:${command} timedout`,
                });
            }, 30000);
            emitter.once(nonce, (_a) => {
                var { err } = _a, data = __rest(_a, ["err"]);
                clearTimeout(timeOut);
                err ? rej({ err }) : res(data);
            });
        });
        _commandQueue.push({
            method,
            command,
            param: payload,
            nonce,
        });
        return commandPromise;
    };
    const get = (command, payload) => _sendCommand({ method: "GET", command, payload });
    const post = (command, payload) => _sendCommand({ method: "POST", command, payload });
    const getMatrixClient = () => matrixClient;
    return { get, post, getMatrixClient };
});
export { cypherNodeMatrixTransport };
