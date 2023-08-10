"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FileHandlerController_1 = require("../../controllers/FileHandlerController");
const FH = new FileHandlerController_1.FileHandlerController();
const postRoutes = (0, express_1.Router)();
/*
postRoutes.post("/addReviewImgs", authMiddleware, FH.addReviewImgs)
postRoutes.post("/addResImgs", authMiddleware, FH.addResImgs)
postRoutes.post("/addResDoc", authMiddleware, FH.addResDoc)
*/
postRoutes.post("/addReviewImgs", FH.addReviewImgs); // for test purposes
exports.default = postRoutes;
