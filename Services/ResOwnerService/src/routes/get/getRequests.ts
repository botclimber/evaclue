import { Request, Response, Router } from "express";
import { ResOwnerController } from "../../controllers/ResOwnerController";

const resInstance: ResOwnerController = new ResOwnerController();
const getRoutes = Router();

getRoutes.get("/getAll", resInstance.resOwners)
getRoutes.get("/getByCity", resInstance.getByCity)

export default getRoutes