"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GeoLocationController_1 = require("../../controllers/GeoLocationController");
// import { authMiddleware } from "../../../../CommonUtils/src/middlewares/authMiddleware"; not used cause it is supposed to be access by internal services for the moment. Anyhow it is possible to be accessed directly by the outside world
const geoInstance = new GeoLocationController_1.GeoLocation();
const postRoutes = (0, express_1.Router)();
postRoutes.post("/create", geoInstance.create);
exports.default = postRoutes;
