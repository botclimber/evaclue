"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidator = void 0;
const Db_1 = require("../../../CommonUtils/src/db/Db");
const date_and_time_1 = __importDefault(require("date-and-time"));
const RevChecker_1 = require("../../../CommonUtils/src/models/RevChecker");
const DateFormat_1 = require("../../../CommonUtils/src/helpers/DateFormat");
class ReviewValidator {
    constructor() {
        this.db = new Db_1.Db();
    }
    async reviewLimit(userId, addressId) {
        const table = "RevChecker";
        const query = `userId = ${userId}`;
        console.log("Verifying if review for this address already exists...");
        const getRevCheckerData = await this.db.selectAll(table, query);
        console.log("Data get from Db:");
        console.log(getRevCheckerData);
        const getAddressReview = (getRevCheckerData !== undefined) ? getRevCheckerData.filter(r => r.addressId == addressId) : [];
        console.log("getAddressReview: ");
        console.log(getAddressReview);
        if (!(getAddressReview.length > 0)) {
            console.log("This user doesnt have any review for this address yet");
            // create record
            await this.createRevCheckerRecord(userId, addressId);
            return false;
        }
        else {
            const lastDate = new Date(getAddressReview[0].lastReviewDate);
            const lastDatePlus6 = date_and_time_1.default.addMonths(lastDate, 6);
            const currentDate = new Date();
            if (currentDate > lastDatePlus6) {
                const chgConfig = { table: "RevChecker", id: getAddressReview[0].id, columns: ["lastReviewDate", "totReviews"], values: [date_and_time_1.default.format(new Date(currentDate), "YYYY-MM-DD HH:mm:ss"), getAddressReview[0].totReviews + 1] };
                await this.db.update(chgConfig);
                return false;
            }
            else
                return true;
        }
    }
    async createRevCheckerRecord(userId, addressId) {
        if (addressId === -1)
            return; // for test purposes only
        const revChecker = new RevChecker_1.RevChecker(userId, addressId, 1, (0, DateFormat_1.genNewDate)(), (0, DateFormat_1.genNewDate)());
        console.log("Creating record on RevChecker table ...");
        await this.db.insert(revChecker);
        console.log("Record Created");
    }
}
exports.ReviewValidator = ReviewValidator;
