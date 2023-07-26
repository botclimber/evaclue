import { Request, Response, Router } from "express";
import { GeoLocation } from "../../controllers/GeoLocationController";
import { AddressActions } from "../../controllers/AddressActions";
import { ResidenceActions } from "../../controllers/ResidenceActions";

const geoInstance: GeoLocation = new GeoLocation();
const addressActionsClass = new AddressActions();
const residenceActionsClass = new ResidenceActions();

const getRoutes = Router();

getRoutes.get("/search", geoInstance.search)
getRoutes.get("/addresses", addressActionsClass.getAddresses)
getRoutes.get("/residences", residenceActionsClass.getResidences)

export default getRoutes