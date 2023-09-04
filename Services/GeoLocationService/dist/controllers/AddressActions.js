"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressActions = void 0;
const Db_1 = require("../db/Db");
const Addresses_1 = require("../models/Addresses");
class AddressActions {
    constructor() {
        this.db = new Db_1.Db();
    }
    async newAddress(addr) {
        const exists = await this.db.selectAll("Addresses", `lat=${addr.lat} and lng=${addr.lng}`);
        try {
            console.log("check if this address is already registed ...");
            console.log(exists);
            if (exists.length) {
                return exists[0].id;
            }
            else {
                const newAddr = new Addresses_1.Addresses(addr.lat, addr.lng, addr.city, addr.street, addr.nr, addr.postalCode, addr.country);
                const id = await this.db.insert(newAddr);
                return id;
            }
        }
        catch (e) {
            console.log(e);
            throw e;
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
