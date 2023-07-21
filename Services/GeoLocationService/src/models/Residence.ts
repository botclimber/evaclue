export class Residence {
    id?: number;
    addressId: number;
    floor: string;
    direction: string;

    constructor(addressId: number, floor: string, direction: string){
        this.addressId = addressId;
        this.floor = floor;
        this.direction = direction;
    }
}