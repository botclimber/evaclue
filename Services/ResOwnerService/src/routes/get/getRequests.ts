import { Request, Response, Router } from "express";
import { ResOwnerController } from "../../controllers/ResOwnerController";
import { authMiddleware } from "../../../../CommonUtils/src/middlewares/authMiddleware";

const resInstance: ResOwnerController = new ResOwnerController();
const getRoutes = Router();

getRoutes.get("/getAll", authMiddleware, resInstance.resOwners)
getRoutes.get("/getByUser", authMiddleware, resInstance.getByOwnerId)
getRoutes.get("/getByCity", resInstance.getByCity) // ?city=???

export default getRoutes