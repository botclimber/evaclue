import { Request, Response, Router } from "express";
import { ReviewsController } from "../../controllers/ReviewsController";
import { authMiddleware } from "../../../../CommonUtils/src/middlewares/authMiddleware";

const RevInstance: ReviewsController = new ReviewsController();
const patchRoutes: Router = Router();

patchRoutes.patch("/update/:revId", authMiddleware, RevInstance.update)

export default patchRoutes