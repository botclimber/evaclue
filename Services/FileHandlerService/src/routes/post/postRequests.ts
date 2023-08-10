import { Response, Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { FileHandlerController } from "../../controllers/FileHandlerController";

const FH: FileHandlerController = new FileHandlerController();

const postRoutes = Router();

/*
postRoutes.post("/addReviewImgs", authMiddleware, FH.addReviewImgs)
postRoutes.post("/addResImgs", authMiddleware, FH.addResImgs)
postRoutes.post("/addResDoc", authMiddleware, FH.addResDoc)
*/

postRoutes.post("/addReviewImgs", FH.addReviewImgs) // for test purposes

export default postRoutes