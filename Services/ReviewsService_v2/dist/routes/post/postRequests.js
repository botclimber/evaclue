"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReviewsController_1 = require("../../controllers/ReviewsController");
const RevInstance = new ReviewsController_1.ReviewsController();
const postRoutes = (0, express_1.Router)();
postRoutes.get("/post", RevInstance.postTest);
exports.default = postRoutes;
