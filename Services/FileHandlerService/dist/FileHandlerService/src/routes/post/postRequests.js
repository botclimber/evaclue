"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FileHandlerController_1 = require("../../controllers/FileHandlerController");
const FH = new FileHandlerController_1.FileHandlerController();
const postRoutes = (0, express_1.Router)();
// TODO: only intern services or users with high privileges can access this requests
postRoutes.post("/addReviewImgs", FH.addReviewImgs);
postRoutes.post("/addResImgs", FH.addResImgs);
postRoutes.post("/addResDoc", FH.addResDoc);
postRoutes.post("/addTicketAttach", FH.addTicketAttachment);
exports.default = postRoutes;
