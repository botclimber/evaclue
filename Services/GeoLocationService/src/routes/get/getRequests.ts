import { Request, Response, Router } from "express";
import { GeoLocation } from "../../controllers/GeoLocationController";

const geoInstance: GeoLocation = new GeoLocation();
const getRoutes = Router();

getRoutes.get("/search", geoInstance.search)

export default getRoutes