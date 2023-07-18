"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsController = void 0;
class ReviewsController {
    async getTest(req, res, next) {
        res.status(200).json({ msg: "GET works!" });
    }
    async postTest(req, res, next) {
        return res.status(200).json({ msg: "POST works!" });
    }
}
exports.ReviewsController = ReviewsController;
