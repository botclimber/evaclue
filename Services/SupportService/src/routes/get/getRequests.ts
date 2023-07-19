import { Request, Response, Router } from "express";
import { ReviewsController } from "../../controllers/ReviewsController";

const RevInstance: ReviewsController = new ReviewsController();
const getRoutes = Router();

getRoutes.get("/reviews", RevInstance.reviews)

export default getRoutes