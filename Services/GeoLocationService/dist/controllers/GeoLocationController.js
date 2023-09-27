"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoLocation = void 0;
const LocationHandler_1 = require("./LocationHandler");
const AddressActions_1 = require("./AddressActions");
const ResidenceActions_1 = require("./ResidenceActions");
const errorMessages_1 = require("../helpers/errorMessages");
class GeoLocation {
    /**
     * Create Location (Address and Residence) return address and residence ids
     *
     * @param eq
     * @param res
     * @param next
     */
    async create(req, res, next) {
        try {
            const createSendResponse = async (addr) => {
                console.log("Trying to create or get address ...");
                const addrId = await new AddressActions_1.AddressActions().newAddress(addr);
                console.log(`address id is ${addrId}`);
                console.log("Trying to create residence ...");
                if (typeof (addrId) === "number") {
                    const residence = { addressId: addrId, floor: addr.floor, direction: addr.direction };
                    const resId = await new ResidenceActions_1.ResidenceActions().newResidence(residence);
                    res.status(200).json({ msg: "Address and Residence row created!", addrId: addrId, resId: resId });
                }
                else
                    res.status(addrId.status).json({ msg: addrId.text });
            };
            const addr = req.body.address;
            const residence = req.body.residence;
            console.log(req);
            console.log(addr);
            console.log(residence);
            if (addr.lat === undefined && addr.lng === undefined) {
                const locInstance = new LocationHandler_1.LocationHandler({ city: addr.city, street: addr.street, buildingNr: addr.nr });
                const latLng = await locInstance.getLatLng();
                if (latLng.lat !== undefined && latLng.lng !== undefined)
                    await createSendResponse({ ...latLng, ...addr, ...residence });
                else {
                    res.status(errorMessages_1.errorMessages.INVALID_LOCATION.status).json({ msg: errorMessages_1.errorMessages.INVALID_LOCATION.text });
                    throw Error(errorMessages_1.errorMessages.INVALID_LOCATION.text);
                }
            }
            else
                await createSendResponse({ ...addr, ...residence });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({ msg: "something went wrong" });
        }
    }
    /**
     * Retrieve a specific location (city or/and street or/and building nr)
     *
     * @param req
     * @param res
     * @param next
     */
    async search(req, res, next) {
        // TODO: check if city, street bNr already exists in database before requesting coords to maps api
        console.log(req.query);
        const locHandler = new LocationHandler_1.LocationHandler(req.query);
        const latLng = await locHandler.getLatLng();
        res.status(200).json({ lat: latLng.lat, lng: latLng.lng });
    }
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async getAddresses(req, res, next) {
        try {
            const addresses = await new AddressActions_1.AddressActions().getAddresses();
            return res.status(200).json({ addresses: addresses });
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async getResidences(req, res, next) {
        try {
            const residences = await new ResidenceActions_1.ResidenceActions().getResidences();
            return res.status(200).json({ residences: residences });
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
}
exports.GeoLocation = GeoLocation;
