"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsController = void 0;
const axios_1 = __importDefault(require("axios"));
const Reviews_1 = require("../../../CommonUtils/src/models/Reviews");
const ReviewValidator_1 = require("../middlewares/ReviewValidator");
const DateFormat_1 = require("../../../CommonUtils/src/helpers/DateFormat");
const authorization_1 = require("../../../CommonUtils/src/middlewares/authorization");
const errorMessages_1 = require("../../../CommonUtils/src/helpers/errorMessages");
const ReviewActions_1 = require("./ReviewActions");
const eva = __importStar(require("eva-functional-utils"));
const reviewActions = new ReviewActions_1.ReviewActions();
class ReviewsController {
    async reviews(req, res, next) {
        try {
            // TODO: at the moment approved reviews are handle on client side. Maybe depending on user type return only approved reviews and also on backend filtered anonymous user info
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
        const address = { lat: data.lat, lng: data.lng, city: data.city, street: data.street, nr: data.nr, postalCode: "0000-000", country: "Portugal", flag: data.flag };
        const residence = (data.floor && data.direction) ? { floor: data.floor, direction: data.direction } : {};
        if (eva.isEmpty(data.review))
            res.status(400).json({ msg: `Review is empty!` });
        else {
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
                    // TODO: enable review limit
                    //if(!reviewLimit){
                    if (true) {
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
                    .catch(err => {
                    console.log(`Response from GeoLocation server: ${err}`);
                    res.status(err.response.status).json({ msg: err.response.data.msg });
                });
            }
            catch (e) {
                console.log(e);
                throw e;
            }
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
