import { serial, TestInterface } from "ava";
import { client as _btcClient } from "../clients/btcClient";
import cypherNodeHttpTransport from "../transport/cypherNodeHttpTransport";
import { CypherNodeBtcClient, AddressType } from "../lib/types/btc.d";
import { cypherNodeMatrixBridge } from "../bridge/cypherNodeMatrixBridge";
import { cypherNodeMatrixTransport } from "../transport/cyphernodeMatrixTransport";
import { getSyncMatrixClient } from "../lib/matrixUtil";
import { queue } from "async";
import uuid from "uuid/v4";
import _debug from "debug";
const debug = _debug("mqtt");
const test = serial as TestInterface<CypherNodeBtcClient & any>; //FIXME this bullshit, interface for Matrix
test.before(async t => {
  const getCypherNodeClient = () =>
    cypherNodeHttpTransport({});

  t.context = {
    getCypherNodeClient,
    getSyncMatrixClient,
    apiKey: process.env.CYPHERNODE_API_KEY,
    baseUrl: process.env.CYPHERNODE_MATRIX_SERVER
  };
});

test("Should be able to route and process a cypherNode-sdk request over Matrix", async t => {
  const {
    baseUrl,
    getSyncMatrixClient,
    getCypherNodeClient,
    apiKey
  } = t.context;
  // Setup server
  const serverMatrixClient = await getSyncMatrixClient({
    baseUrl,
    password: process.env.CYPHERNODE_MATRIX_PASS,
    user: process.env.CYPHERNODE_MATRIX_USER
  });

  const { startBridge, getRoomId } = cypherNodeMatrixBridge({
    cypherNodeClient: getCypherNodeClient(),
    matrixClient: serverMatrixClient
  });
  await startBridge({
    inviteUser: [process.env.CYPHERNODE_MATRIX_TEST_CLIENT_USER]
  });
	// Setup client (frontside)
  const transportMatrixClient = await getSyncMatrixClient({
    baseUrl,
    password: process.env.CYPHERNODE_MATRIX_TEST_CLIENT_PASS,
    user: process.env.CYPHERNODE_MATRIX_TEST_CLIENT_USER
  });
  const btcClient = _btcClient({ 
    transport: await cypherNodeMatrixTransport({
      client: transportMatrixClient,
      roomId: getRoomId()
    })
  })
  // Send your request
  const hash = await btcClient.getBestBlockHash();
  t.true(!!hash.length);
});
