class Addresses {
  constructor(lat, lng, city, street, nr, postalCode, country){
    this.lat = lat
    this.lng = lng
    this.city = city
    this.street = street
    this.nr = nr
    this.postalCode = postalCode || "0000-000" //must be specified by user ? is this really needed ?
    this.country = country || "Portugal" // need to find a way of getting it by some hidden logic
  }
}

class ResidenceAddresses{
	constructor(addrId, floor, direction){

		this.addressId = addrId
		this.floor = floor
		this.direction = direction
	}
}


module.exports = {
  Addresses: Addresses,
  ResidenceAddresses: ResidenceAddresses}
