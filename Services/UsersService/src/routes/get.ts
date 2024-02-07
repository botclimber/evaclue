import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const getRoutes = Router();

getRoutes.get("/profile", authMiddleware, new UserController().getProfile);

getRoutes.get(
    "/recover-password/request/:email",
    new UserController().RecoverUserPasswordEmailRequest
);

getRoutes.get("/verify/:userId/:token", new UserController().VerifyUser);

export default getRoutes;
