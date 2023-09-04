"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResOwnerActions = void 0;
const Db_1 = require("../db/Db");
const errorMessages_1 = require("../helpers/errorMessages");
const DateFormat_1 = require("../helpers/DateFormat");
class ResOwnerActions {
    constructor() {
        this.db = new Db_1.Db();
    }
    async getResOwners() {
        try {
            const resOwners = await this.db.selectAll("ResidenceOwners");
            return resOwners;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async getByCity(city) {
        try {
            const addresses = await this.db.selectAll("Addresses", `upper(city) = "${city}"`);
            const addressesMap = new Map();
            addresses.forEach(r => addressesMap.set(r.id, r));
            const resOwners = await this.db.selectAll("ResidenceOwners");
            const filteredResOwners = resOwners.filter(r => r.free && r.approved === 1 && Array.from(addressesMap.keys()).includes(r.addressId));
            if (filteredResOwners.length) {
                const dataToBeSent = filteredResOwners.map(row => {
                    const addr = addressesMap.get(row.addressId);
                    return { ...row, ...addr };
                });
                // TODO: Filter data that is being sent and shown on client side
                return dataToBeSent;
            }
            else
                throw Error(errorMessages_1.errorMessages.NO_AVAILABILITY.text);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async create(data) {
        try {
            const resOwnerId = this.db.insert(data);
            return resOwnerId;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async exists(userId) {
        const exists = await this.db.selectAll("ResidenceOwners", `userId = ${userId}`);
        if (exists.length) {
            return true;
        }
        else
            return false;
    }
    async update(claimId, body) {
        try {
            const chgConfig = { table: "ResidenceOwners", id: claimId, columns: ["adminId", "approved", "approvedOn"], values: [body.userId, body.state || 0, (0, DateFormat_1.genNewDate)()] };
            await this.db.update(chgConfig);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
}
exports.ResOwnerActions = ResOwnerActions;
