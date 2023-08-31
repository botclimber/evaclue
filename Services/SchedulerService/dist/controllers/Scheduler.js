"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const axios_1 = __importDefault(require("axios"));
const errorMessages_1 = require("../helpers/errorMessages");
const Db_1 = require("../db/Db");
class Scheduler {
    constructor() {
        // TODO: complete method
        this.mountData = async () => {
            const db = new Db_1.Db();
            const addresses = await db.selectAll("Addresses");
            const resOwners = await db.selectAll("ResidenceOwners");
            const usersFilters = await db.selectAll("NBOFilters");
            const users = await db.selectAll("Users");
            const residences = await db.selectAll("Residences");
            const usersMap = new Map();
            const residencesMap = new Map();
            users.forEach(user => {
                if (user.id)
                    usersMap.set(user.id, user);
            });
            residences.map(residence => {
                if (residence.id)
                    residencesMap.set(residence.id, residence);
            });
            console.log("filtering on free and approved residences ...");
            const filteredByFreeResOwners = resOwners.filter(r => r.free && r.approved);
            const mapResToAddress = (res) => {
                const city = addresses.find(r => r.id == res.addressId);
                if (city === undefined)
                    throw Error(errorMessages_1.errorMessages.ADDRESS_SEGMENT_FAULT.text);
                return { ...res, ...{ address: city } };
            };
            console.log("match residence owner with address ...");
            const resOwnerPlusCity = filteredByFreeResOwners.map(mapResToAddress);
            console.log("Prepare data to be sent within the request ...");
            console.log(usersFilters);
            const usersToBeNotified = usersFilters.filter(r => r.enable).map(r => {
                var _a;
                const email = (_a = usersMap.get(r.userId)) === null || _a === void 0 ? void 0 : _a.email;
                if (email) {
                    const cities = r.byCities.toUpperCase();
                    const rent = [r.byRentPriceMin, r.byRentPriceMax];
                    const byCity = (cities.length > 0) ? resOwnerPlusCity.filter(resData => cities.includes(resData.address.city.toUpperCase())) : resOwnerPlusCity;
                    const regardinglessCity = (resData) => (rent[1] > 0) ? resData.rentPrice > rent[0] && resData.rentPrice < rent[1] : true;
                    const byRent = byCity.filter(regardinglessCity);
                    return {
                        toEmail: email,
                        available: byRent.map(data => {
                            var _a, _b;
                            return { resOwnerId: data.userId, city: data.address.city, street: data.address.street, nr: data.address.nr, floor: ((_a = residencesMap.get(data.resId)) === null || _a === void 0 ? void 0 : _a.floor) || "???", direction: ((_b = residencesMap.get(data.resId)) === null || _b === void 0 ? void 0 : _b.direction) || "???", rentPrice: data.rentPrice, lat: data.address.lat, lng: data.address.lng };
                        })
                    };
                }
                else
                    throw Error(errorMessages_1.errorMessages.EMAIL_SEGMENT_FAULT.text);
            });
            return usersToBeNotified;
        };
    }
    async sendAvailableResidencesByFilter() {
        const data = await this.mountData();
        console.log("Data preparation finished:");
        console.log(data);
        console.log("\n sending request to Notification Service ...");
        await axios_1.default
            .post(`http://localhost:${process.env.not_PORT}/notifications/v1/notifyUsers`, { data: data }, { headers: { "Content-Type": "application/json" } })
            .then(response => console.log(response))
            .catch(err => console.log(err));
    }
}
exports.Scheduler = Scheduler;
