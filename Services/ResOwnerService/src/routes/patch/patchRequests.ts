import { Request, Response, Router } from "express";
import { ResOwnerController } from "../../controllers/ResOwnerController";
import { authMiddleware } from "../../../../CommonUtils/src/middlewares/authMiddleware";

const resInstance: ResOwnerController = new ResOwnerController();
const patchRoutes = Router();

patchRoutes.patch("/updateApproval/:claimId", authMiddleware, resInstance.update)

export default patchRoutes