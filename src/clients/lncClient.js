var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cypherNodeHTTPTransport from "../transport/cypherNodeHttpTransport";
export const client = ({ transport = cypherNodeHTTPTransport() } = {}) => {
    const { get, post } = transport;
    const api = {
        getNodeInfo() {
            return get("ln_getinfo");
        },
        getConnectionString() {
            return __awaiter(this, void 0, void 0, function* () {
                const { connectstring } = yield get("ln_getconnectionstring");
                return connectstring;
            });
        },
        getNewAddress() {
            return __awaiter(this, void 0, void 0, function* () {
                const { address } = yield get("ln_newaddr");
                return address;
            });
        },
        createInvoice(invoice) {
            return post("ln_create_invoice", invoice);
        },
        getInvoice(invoiceLabel) {
            return __awaiter(this, void 0, void 0, function* () {
                const { invoices } = yield get("ln_getinvoice", invoiceLabel);
                return invoices;
            });
        },
        /** FAILS 403 */
        deleteInvoice(invoiceLabel) {
            return __awaiter(this, void 0, void 0, function* () {
                const invoice = yield get("ln_delinvoice", invoiceLabel);
                return invoice;
            });
        },
        decodeBolt(bolt11) {
            return get("ln_decodebolt11", bolt11);
        }
    };
    return api;
};
