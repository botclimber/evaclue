import { Response, Router } from "express";
import { ResOwnerController } from "../../controllers/ResOwnerController";
import { authMiddleware } from "../../../../CommonUtils/src/middlewares/authMiddleware";

const resInstance: ResOwnerController = new ResOwnerController();

const delRoutes = Router();

delRoutes.delete("/release", authMiddleware, resInstance.releaseResidence)

export default delRoutes