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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("async");
var v4_1 = __importDefault(require("uuid/v4"));
var debug_1 = __importDefault(require("debug"));
var events_1 = require("events");
var matrixUtil_1 = require("../lib/matrixUtil");
var debug = debug_1.default("cypherNodeMatrixTransport");
var cypherNodeMatrixTransport = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.roomId, roomId = _c === void 0 ? "" : _c, _d = _b.client, client = _d === void 0 ? matrixUtil_1.getSyncMatrixClient() : _d, _e = _b.emitter, emitter = _e === void 0 ? new events_1.EventEmitter() : _e;
    return __awaiter(_this, void 0, void 0, function () {
        var matrixClient, transportRoom, _commandQueue, _sendCommand, get, post, getMatrixClient;
        var _this = this;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!roomId)
                        throw "Must provide a room for the transport";
                    return [4 /*yield*/, client];
                case 1:
                    matrixClient = _f.sent();
                    return [4 /*yield*/, matrixClient.joinRoom(roomId)];
                case 2:
                    transportRoom = _f.sent();
                    debug("Transport in room", transportRoom.roomId);
                    // Setup room lsner, re-emits room commands as nonce events on emitter:w
                    matrixClient.on("Room.timeline", function (event, room, toStartOfTimeline) {
                        // we know we only want to respond to messages
                        if (event.getType() !== "m.room.cypherNodeCommand")
                            return;
                        // we are only intested in messages for our room
                        if (event.getRoomId() === transportRoom.roomId) {
                            var _a = event.getContent(), body = _a.body, msgtype = _a.msgtype;
                            // Make sure this is reply not echo
                            if (msgtype !== "m.commandReply")
                                return;
                            var _b = JSON.parse(body), nonce = _b.nonce, reply = _b.reply;
                            emitter.emit(nonce, __assign({}, reply));
                        }
                    });
                    _commandQueue = async_1.queue(function (_a) {
                        var method = _a.method, command = _a.command, param = _a.param, nonce = _a.nonce;
                        return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        debug("Transport::Command queue sending", method, command, nonce);
                                        return [4 /*yield*/, matrixClient.sendEvent(roomId, "m.room.cypherNodeCommand", {
                                                body: JSON.stringify({ method: method, command: command, param: param, nonce: nonce }),
                                                msgtype: "m.commandRequest"
                                            }, "")];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    }, 1);
                    _sendCommand = function (_a) {
                        var method = _a.method, command = _a.command, payload = _a.payload;
                        var nonce = v4_1.default();
                        var commandPromise = new Promise(function (res, rej) {
                            var timeOut = setTimeout(function () {
                                rej({
                                    err: "Message " + nonce.slice(0, 4) + "-" + nonce.slice(-4) + " " + method + ":" + command + " timedout"
                                });
                            }, 30000);
                            emitter.once(nonce, function (_a) {
                                var err = _a.err, data = __rest(_a, ["err"]);
                                clearTimeout(timeOut);
                                err ? rej({ err: err }) : res(data);
                            });
                        });
                        _commandQueue.push({
                            method: method,
                            command: command,
                            param: payload,
                            nonce: nonce
                        });
                        return commandPromise;
                    };
                    get = function (command, payload) {
                        return _sendCommand({ method: "GET", command: command, payload: payload });
                    };
                    post = function (command, payload) {
                        return _sendCommand({ method: "POST", command: command, payload: payload });
                    };
                    getMatrixClient = function () { return matrixClient; };
                    return [2 /*return*/, { get: get, post: post, getMatrixClient: getMatrixClient }];
            }
        });
    });
};
exports.cypherNodeMatrixTransport = cypherNodeMatrixTransport;
