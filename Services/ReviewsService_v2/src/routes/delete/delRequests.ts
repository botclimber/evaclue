import { Response, Router } from "express";
import { ReviewsController } from "../../controllers/ReviewsController";
import { authMiddleware } from "../../../../CommonUtils/src/middlewares/authMiddleware";

const RevInstance: ReviewsController = new ReviewsController();

const delRoutes = Router();

delRoutes.delete("/delete", authMiddleware, RevInstance.deleteReview)

export default delRoutes