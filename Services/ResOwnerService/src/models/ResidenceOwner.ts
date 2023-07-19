export class ResidenceOwner {
    userId: number;
    userName: string;
    userImg: string;
    adminId: number;
    addressId: number;
    cityLat: number;
    cityLng: number;
    floorOwner: string;
    flatOwner: string;
    rentPrice: number;
    free: boolean;
    createdOn: formatTypes.dateFormat;
    approvedOn: formatTypes.dateFormat;
    approved: number;
    hide: boolean;
    fileProof: string;

    constructor(userId: number, userName: string, userImg: string, adminId: number, addressId: number, cityLat: number, cityLng: number, floorOwner: string, flatOwner: string, rentPrice: number, free: boolean, createdOn: formatTypes.dateFormat, approvedOn: formatTypes.dateFormat, approved: number, hide: boolean, fileProof: string){
        this.userId = userId;
        this.userName = userName;
        this.userImg = userImg;
        this.adminId = adminId;
        this.addressId = addressId;
        this.cityLat = cityLat;
        this.cityLng = cityLng;
        this.floorOwner = floorOwner;
        this.flatOwner = flatOwner;
        this.rentPrice = rentPrice;
        this.free = free
        this.createdOn = createdOn
        this.approvedOn = approvedOn
        this.approved = approved;
        this.hide = hide;
        this.fileProof = fileProof;
    }
}