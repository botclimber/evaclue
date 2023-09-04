"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsController = void 0;
const axios_1 = __importDefault(require("axios"));
const Reviews_1 = require("../models/Reviews");
const ReviewValidator_1 = require("../middlewares/ReviewValidator");
const DateFormat_1 = require("../helpers/DateFormat");
const authorization_1 = require("../middlewares/authorization");
const errorMessages_1 = require("../helpers/errorMessages");
const ReviewActions_1 = require("./ReviewActions");
const reviewActions = new ReviewActions_1.ReviewActions();
class ReviewsController {
    async reviews(req, res, next) {
        try {
            const reviews = await reviewActions.getReviews();
            return res.status(200).json({ reviews: reviews });
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async create(req, res, next) {
        const data = req.body;
        console.log(data);
        const address = { lat: data.lat, lng: data.lng, city: data.city, street: data.street, nr: data.nr, postalCode: "0000-000", country: "Portugal" };
        const residence = (data.floor && data.direction) ? { floor: data.floor, direction: data.direction } : {};
        try {
            console.log("Request creation of Address and Residence if not already existing and as response the IDs");
            console.log(address);
            console.log(residence);
            await axios_1.default
                .post(`http://localhost:${process.env.geo_PORT}/geo/v1/create`, { address: address, residence: residence }, { headers: { "Content-Type": "application/json" } })
                .then(async (response) => {
                console.log("Start validation | check if user already reviewed this Property");
                const revValidator = new ReviewValidator_1.ReviewValidator();
                const reviewLimit = await revValidator.reviewLimit(data.userId, response.data.addrId);
                if (!reviewLimit) {
                    const appr = (data.flag !== "fromMapClick") ? 1 : 0;
                    const rev = new Reviews_1.Reviews(data.userId, 0, response.data.resId, data.review || "", data.rating || 5, (0, DateFormat_1.genNewDate)(), "1000-01-01 00:00:00", data.anonymous || false, appr);
                    const revId = await reviewActions.create(rev);
                    if (revId)
                        return res.status(200).json({ msg: "New Review created!", revId: revId });
                    else
                        return res.status(500).json({ msg: "something went wrong when trying to insert review!" });
                }
                else
                    return res.status(errorMessages_1.errorMessages.REPEATED_REVIEW.status).json({ msg: errorMessages_1.errorMessages.REPEATED_REVIEW.text });
            })
                .catch(err => { console.log(err); res.status(500).json({ msg: "Someting went wrong!" }); });
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    /**
     * WARN:
     * his update is to be used specifcly to update review status (pending, approved, rejected)
     *
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async update(req, res, next) {
        const revId = parseInt(req.params.revId);
        const data = req.body;
        if (!revId)
            return res.status(errorMessages_1.errorMessages.MISSING_PARAMS.status).json({ msg: errorMessages_1.errorMessages.MISSING_PARAMS.text });
        if ((0, authorization_1.isAuthz)(data.userType)) {
            try {
                await reviewActions.update(revId, data.decision, data.userId);
                return res.status(200).json({ msg: "Row updated!" });
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        }
        else
            return res.status(errorMessages_1.errorMessages.NO_PERMISSION.status).json({ msg: errorMessages_1.errorMessages.NO_PERMISSION.text });
    }
}
exports.ReviewsController = ReviewsController;
