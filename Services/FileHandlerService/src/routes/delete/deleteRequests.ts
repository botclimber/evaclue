import { Response, Router } from "express";
import { FileHandlerController } from "../../controllers/FileHandlerController";

const FH: FileHandlerController = new FileHandlerController();

const deleteRoutes = Router();

// TODO: token verification
deleteRoutes.delete("/delResFile/:id/:imgNr", FH.deleteResFile)

export default deleteRoutes