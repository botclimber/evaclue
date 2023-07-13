import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();

routes.put("/verify/:userId/:token", new UserController().VerifyUser);

// routes.put("/profileImg/:userId", authMiddleware, new UserController().updateProfileImg);
