"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var cypherNodeHttpTransport_1 = __importDefault(require("../transport/cypherNodeHttpTransport"));
var v4_1 = __importDefault(require("uuid/v4"));
var events_1 = require("events");
var debug_1 = __importDefault(require("debug"));
var matrixUtil_1 = require("../lib/matrixUtil");
var debug = debug_1.default("cypherNodeMatrixServer");
var emitter = new events_1.EventEmitter();
var cypherNodeMatrixBridge = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.matrixClient, matrixClient = _c === void 0 ? matrixUtil_1.getSyncMatrixClient() : _c, _d = _b.cypherNodeClient, cypherNodeClient = _d === void 0 ? cypherNodeHttpTransport_1.default() : _d;
    var serverRoom;
    /**
     * Helper fn that will forwarda n emitter to the room
     * Injected with CN event emitter so we can forward cn events to roomId
     */
    var emitCnEventToRoomId = function (_a) {
        var emitter = _a.emitter, roomId = _a.roomId;
        emitter.on("cn-event", function (payload) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!roomId)
                            return [2 /*return*/];
                        return [4 /*yield*/, matrixClient.sendEvent(roomId, "m.room.cypherNodeEvent", {
                                body: JSON.stringify(__assign({ uuid: v4_1.default() }, payload)),
                                msgtype: "m.cypherNodeEventPayload"
                            }, "")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * @todo Flow
     * 1. start a channel that we use to intiate with user -> qrcode(server,channel,key)
     * 2. user logs in server, channel and sends key
     * 3. server checks if key is valid and calls startServer({inviteUser}) which creates a private channel for that user to start connecting to their cyphernode
     */
    var startBridge = function (_a) {
        var _b = (_a === void 0 ? {} : _a).inviteUser, inviteUser = _b === void 0 ? [] : _b;
        return __awaiter(_this, void 0, void 0, function () {
            var get, post, _room;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        get = cypherNodeClient.get, post = cypherNodeClient.post;
                        return [4 /*yield*/, matrixClient.createRoom({
                                invite: inviteUser,
                                visibility: "private",
                                name: "cyphernode-" + v4_1.default(),
                                room_alias_name: "cyphernode-" + v4_1.default()
                            })];
                    case 1:
                        _room = _c.sent();
                        return [4 /*yield*/, matrixClient.joinRoom(_room.room_id)];
                    case 2:
                        serverRoom = _c.sent();
                        debug("Start Server _room", serverRoom.roomId);
                        matrixClient.on("Room.timeline", function (event, room, toStartOfTimeline) {
                            return __awaiter(this, void 0, void 0, function () {
                                var _a, nonce, method, command, _b, param, reply, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            // we know we only want to respond to command
                                            if (event.getType() !== "m.room.cypherNodeCommand") {
                                                return [2 /*return*/];
                                            }
                                            // we are only intested in cyphernode.commnads for our room
                                            if (event.getRoomId() !== _room.room_id)
                                                return [2 /*return*/];
                                            if (event.getContent().msgtype !== "m.commandRequest")
                                                return [2 /*return*/];
                                            debug("Server::Got message", event.getContent());
                                            matrixClient.sendTyping(_room.room_id, true);
                                            _a = JSON.parse(
                                            // note only body is JSON string
                                            event.getContent().body), nonce = _a.nonce, method = _a.method, command = _a.command, _b = _a.param, param = _b === void 0 ? null : _b;
                                            _c = method;
                                            switch (_c) {
                                                case "GET": return [3 /*break*/, 1];
                                                case "POST": return [3 /*break*/, 3];
                                            }
                                            return [3 /*break*/, 5];
                                        case 1: return [4 /*yield*/, get(command, param)];
                                        case 2:
                                            reply = _d.sent();
                                            return [3 /*break*/, 6];
                                        case 3: return [4 /*yield*/, post(command, param)];
                                        case 4:
                                            reply = _d.sent();
                                            return [3 /*break*/, 6];
                                        case 5:
                                            console.error("Unknown method", method);
                                            return [2 /*return*/];
                                        case 6:
                                            debug("Server::Send Event", nonce, reply);
                                            return [4 /*yield*/, matrixClient.sendEvent(serverRoom.roomId, "m.room.cypherNodeCommand", {
                                                    body: JSON.stringify({ nonce: nonce, reply: reply }),
                                                    msgtype: "m.commandReply"
                                                }, "")];
                                        case 7:
                                            _d.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    var getRoomId = function () { return serverRoom.roomId; };
    return {
        startBridge: startBridge,
        getRoomId: getRoomId,
        emitCnEventToRoomId: emitCnEventToRoomId
    };
};
exports.cypherNodeMatrixBridge = cypherNodeMatrixBridge;
