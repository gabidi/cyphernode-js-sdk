import _cypherNodeClient from "../lib/cypherNodeClient";
import { CypherNodeBtcClient, AddressType } from "../lib/types/btc.d";
import matrix from "matrix-js-sdk";
import { queue } from "async";
import uuid from "uuid/v4";
import { EventEmitter } from "events";
import _debug from "debug";
import { getSyncMatrixClient } from "../lib/matrixUtil";
import { cypherNodeMqttSub } from "../lib/mqttUtil";
const debug = _debug("cypherNodeMatrixServer");
const emitter = new EventEmitter();
const cypherNodeMatrixBridge = ({
  baseUrl = undefined,
  user = undefined,
  password = undefined,
  apiKey = undefined,
  userType = undefined,
  cypherGateway = undefined,
  matrixClient = getSyncMatrixClient({ baseUrl, user, password }),
  cypherNodeClient = _cypherNodeClient({ apiKey, userType, cypherGateway })
} = {}): {
  startBridge: Function;
  getRoomId: Function;
  emitCnEventToRoomId: Function;
} => {
  let serverRoom;
  /**
   * Helper fn that will forwarda n emitter to the room
   * Injected with CN event emitter so we can forward cn events to roomId
   */
  const emitCnEventToRoomId = ({
    emitter,
    roomId
  }: {
    emitter: EventEmitter;
    roomId: string;
  }) => {
    emitter.on("cn-event", async payload => {
      if (!roomId) return;
      await matrixClient.sendEvent(
        roomId,
        "m.room.cypherNodeEvent",
        {
          body: JSON.stringify({ uuid: uuid(), ...payload }),
          msgtype: "m.cypherNodeEventPayload"
        },
        ""
      );
    });
  };
  /**
   * @todo Flow
   * 1. start a channel that we use to intiate with user -> qrcode(server,channel,key)
   * 2. user logs in server, channel and sends key
   * 3. server checks if key is valid and calls startServer({inviteUser}) which creates a private channel for that user to start connecting to their cyphernode
   */
  const startBridge = async ({ inviteUser = [] } = {}) => {
    const { get, post } = cypherNodeClient;
    const _room = await matrixClient.createRoom({
      invite: inviteUser,
      visibility: "private",
      name: `cyphernode-${uuid()}`,
      room_alias_name: `cyphernode-${uuid()}`
    });
    serverRoom = await matrixClient.joinRoom(_room.room_id);
    debug("Start Server _room", serverRoom.roomId);
    matrixClient.on("Room.timeline", async function(
      event,
      room,
      toStartOfTimeline
    ) {
      // we know we only want to respond to command
      if (event.getType() !== "m.room.cypherNodeCommand") {
        return;
      }
      // we are only intested in cyphernode.commnads for our room
      if (event.getRoomId() !== _room.room_id) return;
      if (event.getContent().msgtype !== "m.commandRequest") return;
      debug("Server::Got message", event.getContent());
      matrixClient.sendTyping(_room.room_id, true);
      const { nonce, method, command, param = null } = JSON.parse(
        // note only body is JSON string
        event.getContent().body
      );

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
      await matrixClient.sendEvent(
        serverRoom.roomId,
        "m.room.cypherNodeCommand",
        {
          body: JSON.stringify({ nonce, reply }),
          msgtype: "m.commandReply"
        },
        ""
      );
    });
  };
  const getRoomId = () => serverRoom.roomId;
  return {
    startBridge,
    getRoomId,
    emitCnEventToRoomId
  };
};
export { cypherNodeMatrixBridge };
