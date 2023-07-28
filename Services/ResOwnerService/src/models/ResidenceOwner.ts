export class ResidenceOwner {
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
    fileProof: string;

    constructor(userId: number, adminId: number, addressId: number, resId: number, rentPrice: number, free: boolean, createdOn: formatTypes.dateFormat, approvedOn: formatTypes.dateFormat, approved: number, hide: boolean, fileProof: string){
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
        this.fileProof = fileProof;
    }
}