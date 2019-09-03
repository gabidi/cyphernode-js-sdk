import _cypherNodeClient from "../lib/cypherNodeClient";
import { CypherNodeBtcClient, AddressType } from "../lib/types/btc.d";
import { queue } from "async";
import uuid from "uuid/v4";
import _debug from "debug";
import { EventEmitter } from "events";
import { getSyncMatrixClient } from "../lib/matrixUtil";
import { CypherNodeTransport, CypherNodeCommand } from "../lib/types/clients";
const debug = _debug("cypherNodeMatrixTransport");
const cypherNodeMatrixTransport = async ({
  baseUrl = undefined,
  user = undefined,
  password = undefined,
  roomId = undefined,
  matrixClient = getSyncMatrixClient({ baseUrl, user, password }),
  emitter = new EventEmitter()
} = {}): Promise<CypherNodeTransport & { getMatrixClient: Function }> => {
  const transportRoom = await matrixClient.joinRoom(roomId);
  debug("Transport in room", transportRoom.roomId);
  // Setup room lsner, re-emits room commands as nonce events on emitter:w
  matrixClient.on("Room.timeline", function(event, room, toStartOfTimeline) {
    // we know we only want to respond to messages
    if (event.getType() !== "m.room.cypherNodeCommand") return;
    // we are only intested in messages for our room
    if (event.getRoomId() === transportRoom.roomId) {
      const { body, msgtype } = event.getContent();
      // Make sure this is reply not echo
      if (msgtype !== "m.commandReply") return;
      const { nonce, reply } = JSON.parse(body);
      emitter.emit(nonce, { ...reply });
    }
  });

  // Serialize command sending on matrix
  const _commandQueue = queue(async ({ method, command, param, nonce }) => {
    debug("Transport::Command queue sending", method, command, nonce);
    await matrixClient.sendEvent(
      roomId,
      "m.room.cypherNodeCommand",
      {
        body: JSON.stringify({ method, command, param, nonce }),
        msgtype: "m.commandRequest"
      },
      ""
    );
  }, 1);
  // Sends uuids the comand  and sends it to queue
  // @return a promise that fullfills with commands reply (when emitter emits nonce)
  const _sendCommand = ({
    method,
    command,
    payload
  }: {
    method: "GET" | "POST";
    command: CypherNodeCommand;
    payload: any;
  }) => {
    const nonce = uuid();
    const commandPromise = new Promise((res, rej) => {
      const timeOut = setTimeout(() => {
        rej({
          err: `Message ${nonce.slice(0, 4)}-${nonce.slice(
            -4
          )} ${method}:${command} timedout`
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
  const get = (command: CypherNodeCommand, payload: any) =>
    _sendCommand({ method: "GET", command, payload });
  const post = (command: CypherNodeCommand, payload: any) =>
    _sendCommand({ method: "POST", command, payload });
  const getMatrixClient = () => matrixClient;
  return { get, post, getMatrixClient };
};
export { cypherNodeMatrixTransport };
