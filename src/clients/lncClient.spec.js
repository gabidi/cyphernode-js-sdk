var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { serial } from "ava";
import { client as lnClient } from "./lncClient";
import uuid from "uuid/v4";
const test = serial;
test.before(t => {
    t.context = Object.assign({ lightingInvoiceLabel: uuid() }, lnClient());
});
/**
LN tests
*/
test("Should be able to get the lightning nodes info", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getNodeInfo }, } = t;
    const nodeInfo = yield getNodeInfo();
    t.true(!!nodeInfo.id.length);
    t.false(isNaN(nodeInfo.blockheight));
    t.false(isNaN(nodeInfo.num_peers));
}));
test("Should be able to a connection string", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getConnectionString }, } = t;
    const connString = yield getConnectionString();
    t.is(connString.length, 86);
}));
test("Should be able to a new LN address", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getNewAddress }, } = t;
    const addrs = yield getNewAddress();
    t.is(addrs.length, 42);
}));
test("Should be able to create an invoice", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { createInvoice, lightingInvoiceLabel }, } = t;
    const makeInvoicePayload = {
        msatoshi: 10,
        label: lightingInvoiceLabel,
        description: "Ava Test Inovice",
        expiry: 900,
        callback_url: "http://192.168.122.159",
    };
    const body = yield createInvoice(makeInvoicePayload);
    t.true(!!body);
    const invoice = body;
    t.true(parseInt(invoice.id) > 0);
    t.true(invoice.bolt11.indexOf("ln") === 0);
    t.true(!!invoice.payment_hash.length);
}));
/** FAILS 403 */
test.skip("Should be able to delete an invoice", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { deleteInvoice, lightingInvoiceLabel }, } = t;
    const makeInvoicePayload = {
        msatoshi: 10,
        label: lightingInvoiceLabel,
        description: "Ava Test Inovice",
        expiry: 900,
        callback_url: "http://192.168.122.159",
    };
    const deletedInvoice = yield deleteInvoice(lightingInvoiceLabel);
    t.true(!!deletedInvoice);
    t.true(deletedInvoice.label === lightingInvoiceLabel);
}));
test("Should be able to decode a bolt", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { decodeBolt }, } = t;
    const bolt11 = "lnbc100p1pw0aw9qpp5cm9fu5nyn3vq0892p4ray75pqvetkz6w483u9lvwn7skex2q0m0sdqugfukcmrnyphhyer9wgszxvfsxc6qxqzuycqp2cv44hlzy2vfewyp4e4re0cywurtncpqu9jkvdxj8w8vds2q390pzq79a7d0kfvty7pt24rd8uqg3n0jxz702lkn9l2vxyqwh08ru27qpayvd5j";
    const decodedBolt = yield decodeBolt(bolt11);
    t.true(!!decodedBolt.currency);
    t.false(isNaN(decodedBolt.created_at));
    t.false(decodedBolt.msatoshi === undefined);
    t.true(!!decodedBolt.payment_hash.length);
    t.true(!!decodedBolt.signature.length);
}));
test("Should be able to get invoices and created invoice should be included", (t) => __awaiter(this, void 0, void 0, function* () {
    const { context: { getInvoice, lightingInvoiceLabel }, } = t;
    const invoices = yield getInvoice();
    t.true(invoices.some(({ label }) => label === lightingInvoiceLabel));
}));
