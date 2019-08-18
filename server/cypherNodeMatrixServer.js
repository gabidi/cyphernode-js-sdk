"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cypherNodeClient_1 = __importDefault(require("../lib/cypherNodeClient"));
const v4_1 = __importDefault(require("uuid/v4"));
const events_1 = require("events");
const debug_1 = __importDefault(require("debug"));
const matrixUtil_1 = require("../lib/matrixUtil");
const debug = debug_1.default("cypherNodeMatrixServer");
const emitter = new events_1.EventEmitter();
const cypherNodeMatrixServer = ({ baseUrl = undefined, user = undefined, password = undefined, apiKey = undefined, userType = undefined, cypherGateway = undefined, matrixClient = matrixUtil_1.getSyncMatrixClient({ baseUrl, user, password }), cypherNodeClient = cypherNodeClient_1.default({ apiKey, userType, cypherGateway }) } = {}) => {
    let serverRoom;
    /**
     * Helper fn that will forwarda n emitter to the room
     * Injected with CN event emitter so we can forward cn events to roomId
     */
    const emitCnEventToRoomId = ({ emitter, roomId }) => {
        emitter.on("cn-event", async (payload) => {
            if (!roomId)
                return;
            await matrixClient.sendEvent(roomId, "m.room.cypherNodeEvent", {
                body: JSON.stringify({ uuid: v4_1.default(), ...payload }),
                msgtype: "m.cypherNodeEventPayload"
            }, "");
        });
    };
    /**
     * @todo Flow
     * 1. start a channel that we use to intiate with user -> qrcode(server,channel,key)
     * 2. user logs in server, channel and sends key
     * 3. server checks if key is valid and calls startServer({inviteUser}) which creates a private channel for that user to start connecting to their cyphernode
     */
    const startServer = async ({ inviteUser = [] } = {}) => {
        const { get, post } = cypherNodeClient;
        const _room = await matrixClient.createRoom({
            inviteUser,
            visibility: "private",
            name: `cyphernode-${v4_1.default()}`,
            //topic: "ava-test-topic",
            room_alias_name: `cyphernode-${v4_1.default()}`
        });
        serverRoom = await matrixClient.joinRoom(_room.room_id);
        debug("Start Server _room", serverRoom.roomId);
        matrixClient.on("Room.timeline", async function (event, room, toStartOfTimeline) {
            // we know we only want to respond to command
            if (event.getType() !== "m.room.cypherNodeCommand") {
                return;
            }
            // we are only intested in cyphernode.commnads for our room
            if (event.getRoomId() !== _room.room_id)
                return;
            if (event.getContent().msgtype !== "m.commandRequest")
                return;
            debug("Server::Got message", event.getContent());
            matrixClient.sendTyping(_room.room_id, true);
            const { nonce, method, command, param = null } = JSON.parse(
            // note only body is JSON string
            event.getContent().body);
            let reply;
            switch (method) {
                case "GET":
                    reply = await get(command, param);
                    break;
                case "POST":
                    reply = await post(command, param);
                    break;
                default:
                    console.error("Unknown method", method);
                    return;
            }
            debug("Server::Send Event", nonce, reply);
            await matrixClient.sendEvent(serverRoom.roomId, "m.room.cypherNodeCommand", {
                body: JSON.stringify({ nonce, reply }),
                msgtype: "m.commandReply"
            }, "");
        });
    };
    const getRoomId = () => serverRoom.roomId;
    return {
        startServer,
        getRoomId,
        emitCnEventToRoomId
    };
};
exports.cypherNodeMatrixServer = cypherNodeMatrixServer;
