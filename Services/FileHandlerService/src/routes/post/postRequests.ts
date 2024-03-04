import { Response, Router } from "express";
import { FileHandlerController } from "../../controllers/FileHandlerController";
import { authMiddleware } from "../../../../CommonUtils/src/middlewares/authMiddleware";

const FH: FileHandlerController = new FileHandlerController();

const postRoutes = Router();

postRoutes.post("/addReviewImgs", authMiddleware, FH.addReviewImgs)
postRoutes.post("/addResImgs", authMiddleware, FH.addResImgs)
postRoutes.post("/addResDoc", authMiddleware, FH.addResDoc)
postRoutes.post("/addTicketAttach", authMiddleware, FH.addTicketAttachment)
postRoutes.post("/changeUserProfileImg", authMiddleware, FH.changeUserProfileImg)

export default postRoutes