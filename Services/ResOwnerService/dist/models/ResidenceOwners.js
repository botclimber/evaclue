"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResidenceOwners = void 0;
class ResidenceOwners {
    constructor(userId, adminId, addressId, resId, rentPrice, free, createdOn, approvedOn, approved, hide, fileProof) {
        this.userId = userId;
        this.adminId = adminId;
        this.addressId = addressId;
        this.resId = resId;
        this.rentPrice = rentPrice;
        this.free = free;
        this.createdOn = createdOn;
        this.approvedOn = approvedOn;
        this.approved = approved;
        this.hide = hide;
        this.fileProof = fileProof;
    }
}
exports.ResidenceOwners = ResidenceOwners;
