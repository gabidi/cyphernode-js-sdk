"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cypherNodeClient_1 = __importDefault(require("../lib/cypherNodeClient"));
exports.client = ({ apiKey = undefined, userType = undefined, token = undefined, cypherGateway = undefined, client = cypherNodeClient_1.default({ token, apiKey, userType, cypherGateway }) } = {}) => {
    const { get, post } = client;
    const api = {
        getNodeInfo() {
            return get("ln_getinfo");
        },
        async getConnectionString() {
            const { connectstring } = await get("ln_getconnectionstring");
            return connectstring;
        },
        async getNewAddress() {
            const { address } = await get("ln_newaddr");
            return address;
        },
        createInvoice(invoice) {
            return post("ln_create_invoice", invoice);
        },
        async getInvoice(invoiceLabel) {
            const { invoices } = await get("ln_getinvoice", invoiceLabel);
            return invoices;
        },
        /** FAILS 403 */
        async deleteInvoice(invoiceLabel) {
            const invoice = await get("ln_delinvoice", invoiceLabel);
            return invoice;
        },
        decodeBolt(bolt11) {
            return get("ln_decodebolt11", bolt11);
        }
    };
    return api;
};
