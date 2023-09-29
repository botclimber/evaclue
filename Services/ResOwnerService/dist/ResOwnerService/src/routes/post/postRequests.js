"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ResOwnerController_1 = require("../../controllers/ResOwnerController");
const authMiddleware_1 = require("../../../../CommonUtils/src/middlewares/authMiddleware");
const resInstance = new ResOwnerController_1.ResOwnerController();
const postRoutes = (0, express_1.Router)();
postRoutes.post("/create", authMiddleware_1.authMiddleware, resInstance.create);
exports.default = postRoutes;
