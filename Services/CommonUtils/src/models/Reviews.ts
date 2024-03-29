export class Reviews {
    id?: number;
    userId: number;
    adminId: number;
    residenceId: number;
    review: string;
    rating: number;
    createdOn: formatTypes.dateFormat; // date.format(new Date(), "YYYY/MM/DD HH:mm:ss")
    approvedOn: formatTypes.dateFormat; // "1000-01-01"
    anonymous: boolean;
    approved: number; // 2 - rejected, 0 - pending, 1 - approved TODO: change name to status
    imgs: number;

    constructor(userId: number, adminId: number, residenceId: number, review: string, rating: number, createdOn: formatTypes.dateFormat, approvedOn: formatTypes.dateFormat, anonymous: boolean, approved: number, imgs: number = 0) {
        this.userId = userId;
        this.adminId = adminId;
        this.residenceId = residenceId;
        this.review = review;
        this.rating = rating;
        this.createdOn = createdOn;
        this.approvedOn = approvedOn;
        this.anonymous = anonymous;
        this.approved = approved;
        this.imgs = imgs;
    }
}