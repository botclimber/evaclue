import { Response, Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { FileHandlerController } from "../../controllers/FileHandlerController";

const FH: FileHandlerController = new FileHandlerController();

const postRoutes = Router();

/*
postRoutes.post("/addReviewImgs", authMiddleware, FH.addReviewImgs)
postRoutes.post("/addResImgs", authMiddleware, FH.addResImgs)
postRoutes.post("/addResDoc", authMiddleware, FH.addResDoc)
postRoutes.post("/addticketAttach", authMiddleware FH.addTicketAttachment)
*/

postRoutes.post("/addReviewImgs", FH.addReviewImgs) // for test purposes
postRoutes.post("/addResImgs", FH.addResImgs) // for test purposes
postRoutes.post("/addResDoc", FH.addResDoc) // for test purposes
postRoutes.post("/addticketAttach", FH.addTicketAttachment) // for test purposes

export default postRoutes