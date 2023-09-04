"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = void 0;
class Reviews {
    constructor(userId, adminId, residenceId, review, rating, createdOn, approvedOn, anonymous, approved) {
        this.userId = userId;
        this.adminId = adminId;
        this.residenceId = residenceId;
        this.review = review;
        this.rating = rating;
        this.createdOn = createdOn;
        this.approvedOn = approvedOn;
        this.anonymous = anonymous;
        this.approved = approved;
    }
}
exports.Reviews = Reviews;
