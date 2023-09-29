"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReviewsController_1 = require("../../controllers/ReviewsController");
const authMiddleware_1 = require("../../../../CommonUtils/src/middlewares/authMiddleware");
const RevInstance = new ReviewsController_1.ReviewsController();
const patchRoutes = (0, express_1.Router)();
patchRoutes.patch("/update/:revId", authMiddleware_1.authMiddleware, RevInstance.update);
exports.default = patchRoutes;
