"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var btcClient_1 = require("../clients/btcClient");
var cypherNodeHttpTransport_1 = __importDefault(require("../transport/cypherNodeHttpTransport"));
var cypherNodeMatrixBridge_1 = require("../bridge/cypherNodeMatrixBridge");
var cyphernodeMatrixTransport_1 = require("../transport/cyphernodeMatrixTransport");
var matrixUtil_1 = require("../lib/matrixUtil");
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default("mqtt");
var test = ava_1.serial; //FIXME this bullshit, interface for Matrix
test.before(function (t) { return __awaiter(_this, void 0, void 0, function () {
    var getCypherNodeClient;
    return __generator(this, function (_a) {
        getCypherNodeClient = function () { return cypherNodeHttpTransport_1.default({}); };
        t.context = {
            getCypherNodeClient: getCypherNodeClient,
            getSyncMatrixClient: matrixUtil_1.getSyncMatrixClient,
            apiKey: process.env.CYPHERNODE_API_KEY,
            baseUrl: process.env.CYPHERNODE_MATRIX_SERVER
        };
        return [2 /*return*/];
    });
}); });
test("Should be able to route and process a cypherNode-sdk request over Matrix", function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, baseUrl, getSyncMatrixClient, getCypherNodeClient, apiKey, serverMatrixClient, _b, startBridge, getRoomId, transportMatrixClient, btcClient, _c, _d, hash;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = t.context, baseUrl = _a.baseUrl, getSyncMatrixClient = _a.getSyncMatrixClient, getCypherNodeClient = _a.getCypherNodeClient, apiKey = _a.apiKey;
                return [4 /*yield*/, getSyncMatrixClient({
                        baseUrl: baseUrl,
                        password: process.env.CYPHERNODE_MATRIX_PASS,
                        user: process.env.CYPHERNODE_MATRIX_USER
                    })];
            case 1:
                serverMatrixClient = _e.sent();
                _b = cypherNodeMatrixBridge_1.cypherNodeMatrixBridge({
                    cypherNodeClient: getCypherNodeClient(),
                    matrixClient: serverMatrixClient
                }), startBridge = _b.startBridge, getRoomId = _b.getRoomId;
                return [4 /*yield*/, startBridge({
                        inviteUser: [process.env.CYPHERNODE_MATRIX_TEST_CLIENT_USER]
                    })];
            case 2:
                _e.sent();
                return [4 /*yield*/, getSyncMatrixClient({
                        baseUrl: baseUrl,
                        password: process.env.CYPHERNODE_MATRIX_TEST_CLIENT_PASS,
                        user: process.env.CYPHERNODE_MATRIX_TEST_CLIENT_USER
                    })];
            case 3:
                transportMatrixClient = _e.sent();
                _c = btcClient_1.client;
                _d = {};
                return [4 /*yield*/, cyphernodeMatrixTransport_1.cypherNodeMatrixTransport({
                        client: transportMatrixClient,
                        roomId: getRoomId()
                    })];
            case 4:
                btcClient = _c.apply(void 0, [(_d.transport = _e.sent(),
                        _d)]);
                return [4 /*yield*/, btcClient.getBestBlockHash()];
            case 5:
                hash = _e.sent();
                t.true(!!hash.length);
                return [2 /*return*/];
        }
    });
}); });
