import node_geocoder, * as geoCoder from "node-geocoder";

const options: geoCoder.Options = {
	provider: 'google',
	apiKey: process.env.APIKEY, // for Mapquest, OpenCage, Google Premier
	formatter: 'json' // 'gpx', 'string', ...
};

const geocoder = node_geocoder(options)

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
export class LocationHandler {
    address: locationFormats.location    

    constructor(address: locationFormats.location){
        this.address = address
    }

    async getLatLng(): Promise<locationFormats.latLng>{

        const city = this.address.city || "Lisboa";
        const street = this.address.street || "";
        const bNumber = this.address.buildingNr || "";
        const rAddress = `${city}, ${street} ${bNumber}` || this.address.city || "Lisboa"

        const res = await geocoder.geocode(rAddress)

        return {lat: res[0].latitude, lng: res[0].longitude}

    }
}
