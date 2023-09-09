import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();


// routes.get("/profile", authMiddleware, new UserController().getProfile);