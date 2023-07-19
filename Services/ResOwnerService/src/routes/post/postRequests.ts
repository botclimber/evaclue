import { Response, Router } from "express";
import { ResOwnerController } from "../../controllers/ResOwnerController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const resInstance: ResOwnerController = new ResOwnerController();

const postRoutes = Router();

postRoutes.post("/create", authMiddleware, resInstance.create)

export default postRoutes