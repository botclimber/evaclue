import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const putRoutes = Router();

putRoutes.put("/change-password", authMiddleware, new UserController().ChangePassword);

export default putRoutes;
