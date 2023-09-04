"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationHandler = void 0;
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const options = {
    provider: 'google',
    apiKey: process.env.APIKEY,
    formatter: 'json' // 'gpx', 'string', ...
};
const geocoder = (0, node_geocoder_1.default)(options);
/*
function which converts text location to lat and lng
it is smart enought to figure it out if we are trying to get a city or specific location lat&lng

*/
/**
* Function that will convert address into latitude and longitude.
* It is smart enought to figure it out if we are trying to get a city or specific location (latitude and longitude)
* @param addres address
* @return Object containing latitude and longitude
*/
class LocationHandler {
    constructor(address) {
        this.address = address;
    }
    async getLatLng() {
        const city = this.address.city || "Lisboa";
        const street = this.address.street || "";
        const bNumber = this.address.buildingNr || "";
        const rAddress = `${city}, ${street} ${bNumber}` || this.address.city || "Lisboa";
        const res = await geocoder.geocode(rAddress);
        return { lat: res[0].latitude, lng: res[0].longitude };
    }
}
exports.LocationHandler = LocationHandler;
