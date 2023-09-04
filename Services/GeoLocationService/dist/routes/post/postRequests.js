"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GeoLocationController_1 = require("../../controllers/GeoLocationController");
const geoInstance = new GeoLocationController_1.GeoLocation();
const postRoutes = (0, express_1.Router)();
postRoutes.post("/create", geoInstance.create);
exports.default = postRoutes;
