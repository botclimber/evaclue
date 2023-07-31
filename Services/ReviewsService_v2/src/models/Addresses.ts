
export class Addresses {
    id?: number;
    lat: number;
    lng: number;
    city: string;
    street: string;
    nr: string;
    postalCode: formatTypes.postalCodeFormat;
    country: string;

    constructor(lat: number, lng: number, city: string, street: string, nr: string, postalCode: formatTypes.postalCodeFormat, country: string){
        this.lat = lat;
        this.lng = lng;
        this.city = city;
        this.street = street;
        this.nr = nr;
        this.postalCode = postalCode;
        this.country = country;
    }
}