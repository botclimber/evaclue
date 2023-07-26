import { Request, Response, Router } from "express";
import { ResOwnerController } from "../../controllers/ResOwnerController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const resInstance: ResOwnerController = new ResOwnerController();
const getRoutes = Router();

getRoutes.get("/getAll", authMiddleware, resInstance.resOwners)
getRoutes.get("/getByCity", resInstance.getByCity)

export default getRoutes