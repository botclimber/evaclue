"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevChecker = void 0;
class RevChecker {
    constructor(userId, addressId, totReviews, lastReviewDate, createdOn) {
        this.userId = userId;
        this.addressId = addressId;
        this.totReviews = totReviews;
        this.lastReviewDate = lastReviewDate;
        this.createdOn = createdOn;
    }
}
exports.RevChecker = RevChecker;
