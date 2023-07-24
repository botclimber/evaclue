import { Request, Response, Router } from "express";
import { GeoLocation } from "../../controllers/GeoLocationController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const geoInstance: GeoLocation = new GeoLocation();
const postRoutes = Router();

postRoutes.post("/create", geoInstance.create)

export default postRoutes