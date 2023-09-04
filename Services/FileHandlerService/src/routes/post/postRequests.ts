import { Response, Router } from "express";
import { FileHandlerController } from "../../controllers/FileHandlerController";

const FH: FileHandlerController = new FileHandlerController();

const postRoutes = Router();

// TODO: only intern services or users with high privileges can access this requests
postRoutes.post("/addReviewImgs", FH.addReviewImgs)
postRoutes.post("/addResImgs", FH.addResImgs)
postRoutes.post("/addResDoc", FH.addResDoc)
postRoutes.post("/addTicketAttach", FH.addTicketAttachment)

export default postRoutes