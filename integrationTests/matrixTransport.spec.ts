import { serial, TestInterface } from "ava";
import { client as _btcClient } from "../clients/btcClient";
import _cypherNodeClient from "../lib/cypherNodeClient";
import { CypherNodeBtcClient, AddressType } from "../lib/types/btc.d";
import { cypherNodeMatrixServer } from "../server/cypherNodeMatrixServer";
import { cypherNodeMatrixTransport } from "../transport/cyphernodeMatrixTransport";
import { getSyncMatrixClient } from "../lib/matrixUtil";
import { queue } from "async";
import uuid from "uuid/v4";
import _debug from "debug";
const debug = _debug("mqtt");
const test = serial as TestInterface<CypherNodeBtcClient & any>; //FIXME this bullshit, interface for Matrix
test.before(async t => {
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

test("Should be able to route and process a cypherNode-sdk request over Matrix", async t => {
  const { getSyncMatrixClient, getCypherNodeClient, apiKey } = t.context;
  // Setup server
  const serverMatrixClient = await getSyncMatrixClient({
    baseUrl: "https://matrix.sifir.io",
    password: "}w7'+uB9_@jH_H8~",
    user: "@test7:matrix.sifir.io"
  });
  // create another cypherNodeClent using matrix transport
  const transportMatrixClient = await getSyncMatrixClient({
    baseUrl: "https://matrix.sifir.io",
    password: "}w7'+uB9_@jH_H8~",
    user: "@test5:matrix.sifir.io"
  });

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
