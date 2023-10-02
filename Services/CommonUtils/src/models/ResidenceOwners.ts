export class ResidenceOwners {
    id?: number;
    userId: number;
    adminId: number;
    addressId: number;
    resId: number;
    rentPrice: number;
    free: boolean;
    createdOn: formatTypes.dateFormat;
    approvedOn: formatTypes.dateFormat;
    approved: number;
    hide: boolean;
    bedRooms: number;
    bathRooms: number;
    flatSize: number;
    notes: string;
    parking: boolean;
    elevator: boolean;
    buildingAge: number;

    constructor(userId: number, adminId: number, addressId: number, resId: number, rentPrice: number, free: boolean, createdOn: formatTypes.dateFormat, approvedOn: formatTypes.dateFormat, approved: number, hide: boolean, bedRooms: number = 0, bathRooms: number = 0, flatSize: number = 0.0, notes: string = "", parking: boolean = false, elevator: boolean = false, buildingAge: number = 0){
        this.userId = userId;
        this.adminId = adminId;
        this.addressId = addressId;
        this.resId = resId;
        this.rentPrice = rentPrice;
        this.free = free
        this.createdOn = createdOn
        this.approvedOn = approvedOn
        this.approved = approved;
        this.hide = hide;
        this.bedRooms = bedRooms;
        this.bathRooms = bathRooms;
        this.flatSize = flatSize;
        this.notes = notes;
        this.parking = parking;
        this.elevator = elevator;
        this.buildingAge = buildingAge;
    }
}