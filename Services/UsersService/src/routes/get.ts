import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const getRoutes = Router();

getRoutes.get("/profile", authMiddleware, new UserController().getProfile);

export default getRoutes;
