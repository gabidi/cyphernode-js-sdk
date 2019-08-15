"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const btcClient_1 = require("../clients/btcClient");
const cypherNodeClient_1 = __importDefault(require("../lib/cypherNodeClient"));
const cypherNodeMatrixServer_1 = require("../server/cypherNodeMatrixServer");
const cyphernodeMatrixTransport_1 = require("../transport/cyphernodeMatrixTransport");
const matrixUtil_1 = require("../lib/matrixUtil");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("mqtt");
const test = ava_1.serial; //FIXME this bullshit, interface for Matrix
test.before(async (t) => {
    const getCypherNodeClient = () => cypherNodeClient_1.default({
        apiKey: process.env.CYPHERNODE_API_KEY,
        userType: 3
    });
    t.context = {
        getCypherNodeClient,
        getSyncMatrixClient: matrixUtil_1.getSyncMatrixClient,
        apiKey: process.env.CYPHERNODE_API_KEY
    };
});
test("Should be able to route and process a cypherNode-sdk request over Matrix", async (t) => {
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
    const { startServer, getRoomId } = cypherNodeMatrixServer_1.cypherNodeMatrixServer({
        cypherNodeClient: getCypherNodeClient(),
        matrixClient: serverMatrixClient
    });
    await startServer();
    const frontEndCypherNodeClient = cypherNodeClient_1.default({
        transport: await cyphernodeMatrixTransport_1.cypherNodeMatrixTransport({
            matrixClient: transportMatrixClient,
            roomId: getRoomId()
        }),
        apiKey,
        userType: 3
    });
    const btcClient = btcClient_1.client({ client: frontEndCypherNodeClient });
    // Send your request
    const hash = await btcClient.getBestBlockHash();
    t.true(!!hash.length);
});
