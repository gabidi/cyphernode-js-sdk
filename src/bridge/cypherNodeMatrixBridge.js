var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import _cypherNodeClient from "../lib/cypherNodeClient";
import uuid from "uuid/v4";
import { EventEmitter } from "events";
import _debug from "debug";
import { getSyncMatrixClient } from "../lib/matrixUtil";
const debug = _debug("cypherNodeMatrixServer");
const emitter = new EventEmitter();
const cypherNodeMatrixBridge = ({ baseUrl = undefined, user = undefined, password = undefined, apiKey = undefined, userType = undefined, cypherGateway = undefined, matrixClient = getSyncMatrixClient({ baseUrl, user, password }), cypherNodeClient = _cypherNodeClient({ apiKey, userType, cypherGateway }) } = {}) => {
    let serverRoom;
    /**
     * Helper fn that will forwarda n emitter to the room
     * Injected with CN event emitter so we can forward cn events to roomId
     */
    const emitCnEventToRoomId = ({ emitter, roomId }) => {
        emitter.on("cn-event", (payload) => __awaiter(this, void 0, void 0, function* () {
            if (!roomId)
                return;
            yield matrixClient.sendEvent(roomId, "m.room.cypherNodeEvent", {
                body: JSON.stringify(Object.assign({ uuid: uuid() }, payload)),
                msgtype: "m.cypherNodeEventPayload"
            }, "");
        }));
    };
    /**
     * @todo Flow
     * 1. start a channel that we use to intiate with user -> qrcode(server,channel,key)
     * 2. user logs in server, channel and sends key
     * 3. server checks if key is valid and calls startServer({inviteUser}) which creates a private channel for that user to start connecting to their cyphernode
     */
    const startBridge = ({ inviteUser = [] } = {}) => __awaiter(this, void 0, void 0, function* () {
        const { get, post } = cypherNodeClient;
        const _room = yield matrixClient.createRoom({
            invite: inviteUser,
            visibility: "private",
            name: `cyphernode-${uuid()}`,
            room_alias_name: `cyphernode-${uuid()}`
        });
        serverRoom = yield matrixClient.joinRoom(_room.room_id);
        debug("Start Server _room", serverRoom.roomId);
        matrixClient.on("Room.timeline", function (event, room, toStartOfTimeline) {
            return __awaiter(this, void 0, void 0, function* () {
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
                        reply = yield get(command, param);
                        break;
                    case "POST":
                        reply = yield post(command, param);
                        break;
                    default:
                        console.error("Unknown method", method);
                        return;
                }
                debug("Server::Send Event", nonce, reply);
                yield matrixClient.sendEvent(serverRoom.roomId, "m.room.cypherNodeCommand", {
                    body: JSON.stringify({ nonce, reply }),
                    msgtype: "m.commandReply"
                }, "");
            });
        });
    });
    const getRoomId = () => serverRoom.roomId;
    return {
        startBridge,
        getRoomId,
        emitCnEventToRoomId
    };
};
export { cypherNodeMatrixBridge };
