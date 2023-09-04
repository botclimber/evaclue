"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewActions = void 0;
const Db_1 = require("../db/Db");
const DateFormat_1 = require("../helpers/DateFormat");
class ReviewActions {
    constructor() { this.db = new Db_1.Db(); }
    async getReviews() {
        try {
            const users = await this.db.selectAll("Users");
            const usersMap = new Map();
            users.forEach(r => {
                if (r.id)
                    usersMap.set(r.id, { userName: `${r.firstName} ${r.lastName}`, userImg: r.image });
            });
            const reviews = await this.db.selectAll("Reviews");
            console.log("All reviews:");
            console.log(reviews);
            const filteredReviews = reviews.map(row => {
                const user = usersMap.get(row.userId);
                if (row.anonymous && user) {
                    user.userName = "Anonymous";
                    user.userImg = "default.gif";
                }
                return { ...row, ...user };
            });
            console.log("filteredReviews: ");
            console.log(filteredReviews);
            return filteredReviews;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async create(review) {
        try {
            const result = await this.db.insert(review);
            return result;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async update(revId, decision, adminId) {
        try {
            const chgConfig = { table: "Reviews", id: revId, columns: ["adminId", "approved", "approvedOn"], values: [adminId, decision || 0, (0, DateFormat_1.genNewDate)()] };
            await this.db.update(chgConfig);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
}
exports.ReviewActions = ReviewActions;
