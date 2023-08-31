"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResOwnerController = void 0;
const errorMessages_1 = require("../helpers/errorMessages");
const ResidenceOwners_1 = require("../models/ResidenceOwners");
const authorization_1 = require("../middlewares/authorization");
const axios_1 = __importDefault(require("axios"));
const DateFormat_1 = require("../helpers/DateFormat");
const ResOwnerActions_1 = require("./ResOwnerActions");
const form_data_1 = __importDefault(require("form-data"));
const resOwnerActions = new ResOwnerActions_1.ResOwnerActions();
// TODO: on claim residence check if its an already claimed one
class ResOwnerController {
    async resOwners(req, res, next) {
        const data = req.body;
        if ((0, authorization_1.isAuthz)(data.userType)) {
            try {
                const resOwners = await resOwnerActions.getResOwners();
                return res.status(200).json({ residenceOwners: resOwners });
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        }
        else
            return res.status(errorMessages_1.errorMessages.ADMIN_NOT_FOUND.status).json({ msg: errorMessages_1.errorMessages.ADMIN_NOT_FOUND.text });
    }
    async getByCity(req, res, next) {
        const city = (req.query.city) ? req.query.city.toString().toUpperCase() : undefined;
        if (city) {
            const dataToBeSent = await resOwnerActions.getByCity(city);
            return res.status(200).json(dataToBeSent);
        }
        return res.status(errorMessages_1.errorMessages.ALL_REQUIRED.status).json({ msg: errorMessages_1.errorMessages.ALL_REQUIRED.text });
    }
    async create(req, res, next) {
        const data = req.body;
        if (!req.files || !Object.keys(req.files).includes("proofDocFiles"))
            return res.status(errorMessages_1.errorMessages.MISSING_PARAMS.status).json({ msg: "missing proof doc!" });
        const exists = await resOwnerActions.exists(data.userId);
        if (exists)
            return res.status(errorMessages_1.errorMessages.CLAIMED_ALREADY.status).json({ msg: errorMessages_1.errorMessages.CLAIMED_ALREADY.text });
        const address = (data.lat && data.lng) ? { lat: data.lat, lng: data.lng } : { city: data.city, street: data.street, nr: data.nr, postalCode: "0000-000", country: "Portugal" };
        const residence = (data.floor && data.direction) ? { floor: data.floor, direction: data.direction } : {};
        try {
            // request addr and residence ids
            const response = await axios_1.default
                .post(`http://${process.env.HOST}:${process.env.geo_PORT}/v1/geoLocation/create`, { address: address, residence: residence }, { headers: { "Content-Type": "application/json" } });
            console.log("Request to GeoLocation Response: ");
            console.log(response);
            // check there are empty parameters
            const newResidenceOwner = new ResidenceOwners_1.ResidenceOwners(data.userId, 0, response.data.addrId, response.data.resId, data.rentPrice || 0.0, data.free || false, (0, DateFormat_1.genNewDate)(), "0000-00-00 00:00:00", 0, true, "???");
            const resOwnerId = await resOwnerActions.create(newResidenceOwner);
            if (resOwnerId) {
                console.log(`Record created with id: ${resOwnerId} !`);
                const docData = new form_data_1.default();
                docData.append("resId", resOwnerId);
                docData.append("proofDocFiles", req.files.proofDocFiles);
                console.log("Handling document file ...");
                const result = await axios_1.default.post(`http://${process.env.HOST}:${process.env.fileHandler_PORT}/v1/fileHandler/addResDoc`, { body: docData });
                if (result.status === 200)
                    return res.status(200).json({ msg: "Requested, we gonna analise it!" });
                else
                    return res.status(result.status).json({ msg: result.data.msg });
            }
            else
                return res.status(500).json({ msg: "SOMETHING WENT WRONG!" });
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    /**
     * Update status for a claimed residence
     *
     * @param req
     * @param res
     * @param next
     */
    async update(req, res, next) {
        // check if user is colaborator
        const claimId = parseInt(req.params.claimId);
        const body = req.body;
        if ((0, authorization_1.isAuthz)(body.userType)) {
            if (!claimId)
                return res.status(errorMessages_1.errorMessages.MISSING_PARAMS.status).json({ msg: errorMessages_1.errorMessages.MISSING_PARAMS.text });
            await resOwnerActions.update(claimId, body);
            return res.status(200).json({ msg: "Residence state updated!" });
        }
        else
            return res.status(errorMessages_1.errorMessages.NO_PERMISSION.status).json({ msg: errorMessages_1.errorMessages.NO_PERMISSION.text });
    }
}
exports.ResOwnerController = ResOwnerController;
