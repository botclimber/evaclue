import { Response, Router } from "express";
import { FileHandlerController } from "../../controllers/FileHandlerController";
import {authMiddleware} from "../../../../CommonUtils/src/middlewares/authMiddleware";

const FH: FileHandlerController = new FileHandlerController();

const deleteRoutes = Router();

// TODO: token verification
deleteRoutes.delete("/delResFile/:id/:imgNr", authMiddleware, FH.deleteResFile)

export default deleteRoutes