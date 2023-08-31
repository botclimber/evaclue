"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResidenceActions = void 0;
const Db_1 = require("../db/Db");
const Residences_1 = require("../models/Residences");
class ResidenceActions {
    constructor() {
        this.db = new Db_1.Db();
    }
    async newResidence(res) {
        try {
            const floor = (res.floor) ? res.floor : "";
            const direction = (res.direction) ? res.direction : "";
            const newResidence = new Residences_1.Residences(res.addressId, floor, direction);
            const id = await this.db.insert(newResidence);
            return id;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async getResidences() {
        try {
            const residences = await this.db.selectAll("Residences");
            return residences;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
}
exports.ResidenceActions = ResidenceActions;
