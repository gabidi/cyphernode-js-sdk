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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This example will fetch all your watched Pub32 from Cyphernode and their balances , and then print them out in a simple console output
 */
var btcClient_1 = require("../clients/btcClient");
(function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, getWatchedPub32, getBalanceByPub32Label, getTransactionsByPub32Label, getUnusedAddressesByPub32Label, unwatchPub32ByLabel, getNewAddress, getBalance, watchedPub32, _b, address, balance;
    var _this = this;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = btcClient_1.client(), getWatchedPub32 = _a.getWatchedPub32, getBalanceByPub32Label = _a.getBalanceByPub32Label, getTransactionsByPub32Label = _a.getTransactionsByPub32Label, getUnusedAddressesByPub32Label = _a.getUnusedAddressesByPub32Label, unwatchPub32ByLabel = _a.unwatchPub32ByLabel, getNewAddress = _a.getNewAddress, getBalance = _a.getBalance;
                return [4 /*yield*/, getWatchedPub32()];
            case 1:
                watchedPub32 = _c.sent();
                console.log("You've got " + watchedPub32.length + " watched pub32s!");
                return [4 /*yield*/, Promise.all(watchedPub32.map(function (_a) {
                        var pub32 = _a.pub32, label = _a.label;
                        return __awaiter(_this, void 0, void 0, function () {
                            var _b, balance_1, txns, unused, err_1;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, Promise.all([
                                                getBalanceByPub32Label(label),
                                                getTransactionsByPub32Label(label),
                                                getUnusedAddressesByPub32Label(label)
                                            ])];
                                    case 1:
                                        _b = _c.sent(), balance_1 = _b[0], txns = _b[1], unused = _b[2];
                                        console.log("Label: " + label + "\n\t   Pub32 " + pub32 + "\n\t   balance: " + balance_1 + ", \n           last unused address: " + unused[0].address + "\n\t   devrivation index " + unused[0].address_pub32_index + "\n\t");
                                        if (txns && txns.length) {
                                            console.log(label + " has " + txns.length + " txns");
                                            txns.forEach(function (txn) { return console.log(txn); });
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_1 = _c.sent();
                                        console.error("Poop", err_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        });
                    }))];
            case 2:
                _c.sent();
                return [4 /*yield*/, Promise.all([
                        getNewAddress("bech32"),
                        getBalance()
                    ])];
            case 3:
                _b = _c.sent(), address = _b[0], balance = _b[1];
                console.log("\n\t    Your spending wallet has a balance " + balance + "\n\t    send BTC to : " + address + "\n\t    ");
                return [2 /*return*/];
        }
    });
}); })();
