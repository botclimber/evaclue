module.exports = class Addresses {
  constructor(city, street, nr, floor, direction, lat, lng, postalCode, country){
    this.lat = lat
    this.lng = lng
    this.city = city
    this.street = street
    this.nr = nr
    this.floor = floor
    this.direction = direction
    this.postalCode = postalCode
    this.country = country
  }
}
