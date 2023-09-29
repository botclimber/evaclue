export class RevChecker {
    id?: number;
    userId: number;
    addressId: number;
    totReviews: number;
    lastReviewDate: formatTypes.dateFormat;
    createdOn: formatTypes.dateFormat;

    constructor(userId: number, addressId: number, totReviews: number, lastReviewDate: formatTypes.dateFormat, createdOn: formatTypes.dateFormat){
        this.userId = userId;
        this.addressId = addressId;
        this.totReviews = totReviews;
        this.lastReviewDate = lastReviewDate;
        this.createdOn = createdOn;
    }
}