import { serial, TestInterface } from "ava";
import { client as _btcClient } from "../btcClient";
import _cypherNodeClient from "../lib/cypherNodeClient";
import { CypherNodeBtcClient, AddressType } from "../lib/types/btc.d";
import matrix from "matrix-js-sdk";
import { queue } from "async";
import uuid from "uuid/v4";
import { EventEmitter } from "events";
import _debug from "debug";
const debug = _debug("test");
const test = serial as TestInterface<CypherNodeBtcClient & any>; //FIXME this bullshit, interface for Matrix
test.before(async t => {
  const synapseServer = "https://matrix.sifir.io";
  const password = "}w7'+uB9_@jH_H8~";
  const user = "@test7:matrix.sifir.io";
  const getSyncMatrixClient = async (userId = user) => {
    const matrixClient = await matrix.createClient({
      baseUrl: synapseServer,
      initialSyncLimit: 10,
      timelineSupport: true
    });
    await matrixClient.login("m.login.password", {
      user: userId,
      password
    });
    matrixClient.startClient();
    let syncFailCount = 0;
    return new Promise((res, rej) => {
      matrixClient.once("sync", (syncState, a, event) => {
        if (syncState === "ERROR") {
          debug("Matrix Sync error", event, syncState, a);
          if (event) {
            if (!event.error.data) {
              debug("event.error.data is missing: ", event.error);
            }
            if (event.error.data.errcode === "M_UNKNOWN_TOKEN") {
              debug("toggleMatrixLoginModal", true);
            }
            matrixClient.stop();
            rej(event);
          }
          if (syncFailCount >= 3) {
            debug(
              "error",
              "Could not connect to matrix more than 3 time. Disconnecting."
            );
            // transportMatrixClient.stop();
            rej(`Matrix client failed to sync more than ${syncFailCount}`);
          } else {
            debug(
              "error",
              `Could not connect to matrix server. ${
                syncFailCount ? "Attempt " + syncFailCount : ""
              }`
            );
            syncFailCount++;
          }
        } else if (syncState === "SYNCING") {
          // update UI to remove any "Connection Lost" message
          syncFailCount = 0;
        } else if (syncState === "PREPARED") {
          res(matrixClient);
        }
      });
    });
  };
  const getCypherNodeClient = () =>
    _cypherNodeClient({
      apiKey: process.env.CYPHERNODE_API_KEY,
      userType: 3
    });

  t.context = {
    getCypherNodeClient,
    getSyncMatrixClient,
    apiKey: process.env.CYPHERNODE_API_KEY
  };
});
const cypherNodeMatrixServer = ({
  baseUrl = undefined,
  user = undefined,
  password = undefined,
  apiKey = undefined,
  userType = undefined,
  cypherGateway = undefined,
  matrixClient = matrix.createClient({ baseUrl, user, password }),
  cypherNodeClient = _cypherNodeClient({ apiKey, userType, cypherGateway })
} = {}): { startServer: Function; getRoomId: Function } => {
  let serverRoom;
  const startServer = async () => {
    const { get, post } = cypherNodeClient;
    const _room = await matrixClient.createRoom({
      invite: ["@test5:matrix.sifir.io"],
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

const cypherNodeMatrixTransport = async ({
  baseUrl = undefined,
  user = undefined,
  password = undefined,
  roomId = undefined,
  matrixClient = matrix.createClient({ baseUrl, user, password }),
  emitter = new EventEmitter()
} = {}) => {
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
  const _sendCommand = ({ method, command, payload }) => {
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
  const get = (command, payload) =>
    _sendCommand({ method: "GET", command, param: payload });
  const post = (command, payload) =>
    _sendCommand({ method: "POST", command, param: payload });
  return { get, post };
};
test("Should be able to route and process a cypherNode-sdk request over Matrix", async t => {
  const { getSyncMatrixClient, getCypherNodeClient, apiKey } = t.context;
  // Setup server
  const serverMatrixClient = await getSyncMatrixClient();
  // create another cypherNodeClent using matrix transport
  const transportMatrixClient = await getSyncMatrixClient(
    "@test5:matrix.sifir.io"
  );
  let syncFailCount = 0;

  const { startServer, getRoomId } = cypherNodeMatrixServer({
    cypherNodeClient: getCypherNodeClient(),
    matrixClient: serverMatrixClient
  });
  await startServer();
  const frontEndCypherNodeClient = _cypherNodeClient({
    transport: await cypherNodeMatrixTransport({
      matrixClient: transportMatrixClient,
      roomId: getRoomId()
    }),
    apiKey,
    userType: 3
  });
  const btcClient = _btcClient({ client: frontEndCypherNodeClient });
  // Send your request
  const hash = await btcClient.getBestBlockHash();
  t.true(!!hash.length);
});
