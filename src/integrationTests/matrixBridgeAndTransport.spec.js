var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { serial } from "ava";
import { client as _btcClient } from "../clients/btcClient";
import cypherNodeHttpTransport from "../transport/cypherNodeHttpTransport";
import { cypherNodeMatrixBridge } from "../bridge/cypherNodeMatrixBridge";
import { cypherNodeMatrixTransport } from "../transport/cyphernodeMatrixTransport";
import { getSyncMatrixClient } from "../lib/matrixUtil";
import _debug from "debug";
const debug = _debug("mqtt");
const test = serial; //FIXME this bullshit, interface for Matrix
test.before((t) => __awaiter(this, void 0, void 0, function* () {
    const getCypherNodeClient = () => cypherNodeHttpTransport({});
    t.context = {
        getCypherNodeClient,
        getSyncMatrixClient,
        apiKey: process.env.CYPHERNODE_API_KEY,
        baseUrl: process.env.CYPHERNODE_MATRIX_SERVER
    };
}));
test("Should be able to route and process a cypherNode-sdk request over Matrix", (t) => __awaiter(this, void 0, void 0, function* () {
    const { baseUrl, getSyncMatrixClient, getCypherNodeClient, apiKey } = t.context;
    // Setup server
    const serverMatrixClient = yield getSyncMatrixClient({
        baseUrl,
        password: process.env.CYPHERNODE_MATRIX_PASS,
        user: process.env.CYPHERNODE_MATRIX_USER
    });
    const { startBridge, getRoomId } = cypherNodeMatrixBridge({
        cypherNodeClient: getCypherNodeClient(),
        matrixClient: serverMatrixClient
    });
    yield startBridge({
        inviteUser: [process.env.CYPHERNODE_MATRIX_TEST_CLIENT_USER]
    });
    // Setup client (frontside)
    const transportMatrixClient = yield getSyncMatrixClient({
        baseUrl,
        password: process.env.CYPHERNODE_MATRIX_TEST_CLIENT_PASS,
        user: process.env.CYPHERNODE_MATRIX_TEST_CLIENT_USER
    });
    const btcClient = _btcClient({
        transport: yield cypherNodeMatrixTransport({
            client: transportMatrixClient,
            roomId: getRoomId()
        })
    });
    // Send your request
    const hash = yield btcClient.getBestBlockHash();
    t.true(!!hash.length);
}));
