import { Response, Router } from "express";
import { ReviewsController } from "../../controllers/ReviewsController";
import { authMiddleware } from "../../middlewares/authMiddleware";

const RevInstance: ReviewsController = new ReviewsController();

const postRoutes = Router();

postRoutes.post("/create", authMiddleware, RevInstance.create)

export default postRoutes