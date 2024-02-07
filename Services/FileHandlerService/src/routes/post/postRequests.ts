import { Response, Router } from "express";
import { FileHandlerController } from "../../controllers/FileHandlerController";

const FH: FileHandlerController = new FileHandlerController();

const postRoutes = Router();

// TODO: add token verification and check if user who is trying to manage files is the owner
postRoutes.post("/addReviewImgs", FH.addReviewImgs)
postRoutes.post("/addResImgs", FH.addResImgs)
postRoutes.post("/addResDoc", FH.addResDoc)
postRoutes.post("/addTicketAttach", FH.addTicketAttachment)
postRoutes.post("/changeUserProfileImg", FH.changeUserProfileImg)

export default postRoutes