import { Router } from "express";
import { ResidenceOwnerController } from "../controllers/ResindenceOwnerController";
// import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();

routes.get("/GetAllClaimedResidence", new ResidenceOwnerController().GetAllClaimedResidence);

export default routes;
