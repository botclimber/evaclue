"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ResOwnerController_1 = require("../../controllers/ResOwnerController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const resInstance = new ResOwnerController_1.ResOwnerController();
const patchRoutes = (0, express_1.Router)();
patchRoutes.patch("/updateApproval/:claimId", authMiddleware_1.authMiddleware, resInstance.update);
exports.default = patchRoutes;
