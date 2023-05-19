const geo = require("node-geocoder")

var options = {
	provider: 'google',
	httpAdapter: 'https', // Default
	apiKey: process.env.APIKEY, // for Mapquest, OpenCage, Google Premier
	formatter: 'json' // 'gpx', 'string', ...
};

var geocoder = geo(options);

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
exports.getLatLng = async function (address) {

	var city = address.city || "Braga"
	var street = address.street || ""
	var bNumber = address.buildingNumber || ""
	var rAddress = city + ", " + street + " " + bNumber || address.city || "Braga"

	console.log(rAddress)
	var res = await geocoder.geocode(rAddress)

	return res
}
