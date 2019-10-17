var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import matrix from "matrix-js-sdk";
import _debug from "debug";
const debug = _debug("matrixUtil");
const getSyncMatrixClient = ({ user = process.env.CYPHERNODE_MATRIX_USER, password = process.env.CYPHERNODE_MATRIX_PASS, baseUrl = process.env.CYPHERNODE_MATRIX_SERVER } = {}) => __awaiter(this, void 0, void 0, function* () {
    debug("Conneting to", baseUrl, user);
    const matrixClient = yield matrix.createClient({
        baseUrl,
        initialSyncLimit: 10,
        timelineSupport: true
    });
    yield matrixClient.login("m.login.password", {
        user,
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
                    debug("error", "Could not connect to matrix more than 3 time. Disconnecting.");
                    // transportMatrixClient.stop();
                    rej(`Matrix client failed to sync more than ${syncFailCount}`);
                }
                else {
                    debug("error", `Could not connect to matrix server. ${syncFailCount ? "Attempt " + syncFailCount : ""}`);
                    syncFailCount++;
                }
            }
            else if (syncState === "SYNCING") {
                // update UI to remove any "Connection Lost" message
                syncFailCount = 0;
            }
            else if (syncState === "PREPARED") {
                res(matrixClient);
            }
        });
    });
});
export { getSyncMatrixClient };
