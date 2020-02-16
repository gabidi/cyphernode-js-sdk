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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var lncClient_1 = require("./lncClient");
var v4_1 = __importDefault(require("uuid/v4"));
var test = ava_1.serial;
test.before(function (t) {
    t.context = __assign({ lightingInvoiceLabel: v4_1.default() }, lncClient_1.client());
});
/**
LN tests
*/
test("Should be able to get the lightning nodes info", function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var getNodeInfo, nodeInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getNodeInfo = t.context.getNodeInfo;
                return [4 /*yield*/, getNodeInfo()];
            case 1:
                nodeInfo = _a.sent();
                t.true(!!nodeInfo.id.length);
                t.false(isNaN(nodeInfo.blockheight));
                t.false(isNaN(nodeInfo.num_peers));
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to a connection string", function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var getConnectionString, connString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getConnectionString = t.context.getConnectionString;
                return [4 /*yield*/, getConnectionString()];
            case 1:
                connString = _a.sent();
                t.is(connString.length, 86);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to a new LN address", function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var getNewAddress, addrs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getNewAddress = t.context.getNewAddress;
                return [4 /*yield*/, getNewAddress()];
            case 1:
                addrs = _a.sent();
                t.is(addrs.length, 42);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to create an invoice", function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, createInvoice, lightingInvoiceLabel, makeInvoicePayload, body, invoice;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = t.context, createInvoice = _a.createInvoice, lightingInvoiceLabel = _a.lightingInvoiceLabel;
                makeInvoicePayload = {
                    msatoshi: 10,
                    label: lightingInvoiceLabel,
                    description: "Ava Test Inovice",
                    expiry: 900,
                    callback_url: "http://192.168.122.159"
                };
                return [4 /*yield*/, createInvoice(makeInvoicePayload)];
            case 1:
                body = _b.sent();
                t.true(!!body);
                invoice = body;
                t.true(parseInt(invoice.id) > 0);
                t.true(invoice.bolt11.indexOf("ln") === 0);
                t.true(!!invoice.payment_hash.length);
                return [2 /*return*/];
        }
    });
}); });
/** FAILS 403 */
test.skip("Should be able to delete an invoice", function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, deleteInvoice, lightingInvoiceLabel, makeInvoicePayload, deletedInvoice;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = t.context, deleteInvoice = _a.deleteInvoice, lightingInvoiceLabel = _a.lightingInvoiceLabel;
                makeInvoicePayload = {
                    msatoshi: 10,
                    label: lightingInvoiceLabel,
                    description: "Ava Test Inovice",
                    expiry: 900,
                    callback_url: "http://192.168.122.159"
                };
                return [4 /*yield*/, deleteInvoice(lightingInvoiceLabel)];
            case 1:
                deletedInvoice = _b.sent();
                t.true(!!deletedInvoice);
                t.true(deletedInvoice.label === lightingInvoiceLabel);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to decode a bolt", function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var decodeBolt, bolt11, decodedBolt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decodeBolt = t.context.decodeBolt;
                bolt11 = "lnbc100p1pw0aw9qpp5cm9fu5nyn3vq0892p4ray75pqvetkz6w483u9lvwn7skex2q0m0sdqugfukcmrnyphhyer9wgszxvfsxc6qxqzuycqp2cv44hlzy2vfewyp4e4re0cywurtncpqu9jkvdxj8w8vds2q390pzq79a7d0kfvty7pt24rd8uqg3n0jxz702lkn9l2vxyqwh08ru27qpayvd5j";
                return [4 /*yield*/, decodeBolt(bolt11)];
            case 1:
                decodedBolt = _a.sent();
                t.true(!!decodedBolt.currency);
                t.false(isNaN(decodedBolt.created_at));
                t.false(decodedBolt.msatoshi === undefined);
                t.true(!!decodedBolt.payment_hash.length);
                t.true(!!decodedBolt.signature.length);
                return [2 /*return*/];
        }
    });
}); });
test("Should be able to get invoices and created invoice should be included", function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, getInvoice, lightingInvoiceLabel, invoices;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = t.context, getInvoice = _a.getInvoice, lightingInvoiceLabel = _a.lightingInvoiceLabel;
                return [4 /*yield*/, getInvoice()];
            case 1:
                invoices = _b.sent();
                t.true(invoices.some(function (_a) {
                    var label = _a.label;
                    return label === lightingInvoiceLabel;
                }));
                return [2 /*return*/];
        }
    });
}); });
