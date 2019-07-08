"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const agent = __importStar(require("superagent"));
const crypto_1 = require("crypto");
const v4_1 = __importDefault(require("uuid/v4"));
ava_1.serial.before(t => {
    const cypherGateway = "https://localhost:2009/v0/";
    const makeToken = (api_key, perm = "admin", expiryInSeconds = 3600) => {
        const permissionDict = { admin: 3, spender: 2, general: 1 };
        const id = `00${permissionDict[perm]}`;
        let exp = Math.round(new Date().getTime() / 1000) + expiryInSeconds;
        let h64 = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
        let p64 = Buffer.from(JSON.stringify({ id, exp })).toString("base64");
        let msg = h64 + "." + p64;
        // TODO for browser
        //let hash = CryptoJS.HmacSHA256(`${h64}.${p64}`, api_key).toString();
        const hmac = crypto_1.createHmac("sha256", api_key);
        hmac.update(msg);
        let hash = hmac.digest("hex");
        return `${msg}.${hash}`;
    };
    const token = makeToken("5b5d6ff9027dc1fdce9e84645329a194d79f346b3c7a5338d9610139c1fbd2e8");
    const get = (command, payload = null) => __awaiter(this, void 0, void 0, function* () {
        const { body } = yield agent
            .get(`${cypherGateway}${command}/${payload}`)
            .set("Authorization", `Bearer ${token}`);
        return body;
    });
    const post = (command, payload) => __awaiter(this, void 0, void 0, function* () {
        const { body } = yield agent
            .post(`${cypherGateway}${command}`)
            .set("Authorization", `Bearer ${token}`)
            .send(payload);
        return body;
    });
    t.context = {
        cypherGateway,
        get,
        post,
        token,
        lightingInvoiceLabel: v4_1.default()
    };
});
/*

OTS  test
*/
ava_1.serial("Should be able to generate an OTS file", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { post } } = t;
    const fileHash = md5("#I am some hashed file");
    const poop = yield post("ots_stamp", fileHash);
    console.log(poop);
}));
ava_1.serial("Should be able to get OTS stamp", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { get } } = t;
    const fileHash = "1ddfb769eb0b8876bc570e25580e6a53afcf973362ee1ee4b54a807da2e5eed7";
    const poop = yield get("ots_getfile", fileHash);
    console.log(poop);
}));
