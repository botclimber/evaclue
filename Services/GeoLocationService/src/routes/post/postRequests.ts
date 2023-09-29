import { Request, Response, Router } from "express";
import { GeoLocation } from "../../controllers/GeoLocationController";
// import { authMiddleware } from "../../../../CommonUtils/src/middlewares/authMiddleware"; not used cause it is supposed to be access by internal services for the moment. Anyhow it is possible to be accessed directly by the outside world

const geoInstance: GeoLocation = new GeoLocation();
const postRoutes = Router();

postRoutes.post("/create", geoInstance.create)

export default postRoutes