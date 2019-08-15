import { serial, TestInterface } from "ava";
import _cypherNodeClient from "../lib/cypherNodeClient";
import { CypherNodeBtcClient, AddressType } from "../lib/types/btc.d";
import matrix from "matrix-js-sdk";
import { queue } from "async";
import uuid from "uuid/v4";
import { EventEmitter } from "events";
import _debug from "debug";
import { getSyncMatrixClient } from "../lib/matrixUtil";

const debug = _debug("cypherNodeMatrixServer");
const cypherNodeMatrixServer = ({
  baseUrl = undefined,
  user = undefined,
  password = undefined,
  apiKey = undefined,
  userType = undefined,
  cypherGateway = undefined,
  matrixClient = getSyncMatrixClient({ baseUrl, user, password }),
  cypherNodeClient = _cypherNodeClient({ apiKey, userType, cypherGateway })
} = {}): { startServer: Function; getRoomId: Function } => {
  let serverRoom;
  /**
   * @todo Flow
   * 1. start a channel that we use to intiate with user -> qrcode(server,channel,key)
   * 2. user logs in server, channel and sends key
   * 3. server checks if key is valid and calls startServer({inviteUser}) which creates a private channel for that user to start connecting to their cyphernode
   */
  const startServer = async ({
    inviteUser = ["@test5:matrix.sifir.io"]
  } = {}) => {
    const { get, post } = cypherNodeClient;
    const _room = await matrixClient.createRoom({
      inviteUser,
      visibility: "private", // 'public'
      name: `cyphernode-${uuid()}`,
      //topic: "ava-test-topic",
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
    startServer,
    getRoomId
  };
};
export { cypherNodeMatrixServer };
