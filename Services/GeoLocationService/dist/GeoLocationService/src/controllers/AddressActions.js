"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressActions = void 0;
const Db_1 = require("../../../CommonUtils/src/db/Db");
const eva = __importStar(require("eva-functional-utils"));
const errorMessages_1 = require("../../../CommonUtils/src/helpers/errorMessages");
require("../../../CommonUtils/src/types/globals");
const Addresses_1 = require("../../../CommonUtils/src/models/Addresses");
class AddressActions {
    constructor() {
        this.db = new Db_1.Db();
    }
    async newAddress(addr) {
        if (eva.isEmpty(addr.city) || eva.isEmpty(addr.street) || eva.isEmpty(addr.nr) || eva.isEmpty(addr.flag))
            return errorMessages_1.errorMessages.NOT_VALID_ADDRESS;
        else {
            const operator = (addr.flag === "fromMapClick") ? "or" : (addr.flag === "fromMarker") ? "and" : undefined;
            if (operator) {
                const exists = await this.db.selectAll("Addresses", `(lat=${addr.lat} and lng=${addr.lng}) ${operator} (city="${addr.city}" and street="${addr.street}" and nr="${addr.nr}")`);
                try {
                    console.log("check if this address is already registed ...");
                    console.log(exists);
                    if (exists.length) {
                        return exists[0].id;
                    }
                    else if (addr.flag === "fromMapClick") {
                        const newAddr = new Addresses_1.Addresses(addr.lat, addr.lng, addr.city, addr.street, addr.nr, addr.postalCode, addr.country);
                        const id = await this.db.insert(newAddr);
                        return id;
                    }
                    else
                        return errorMessages_1.errorMessages.INVALID_MARKER_LOCATION;
                }
                catch (e) {
                    console.log(e);
                    throw e;
                }
            }
            else
                return errorMessages_1.errorMessages.INVALID_FLAG;
        }
    }
    async getAddresses() {
        try {
            const addresses = await this.db.selectAll("Addresses");
            return addresses;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
}
exports.AddressActions = AddressActions;
