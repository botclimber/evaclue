import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();

routes.post("/register", new UserController().RegistUser);
routes.post("/googleAuth", new UserController().GoogleAuth);
routes.post("/registerAdmin", new UserController().RegistUserAdmin);
routes.post("/login", new UserController().LoginUser);

routes.post('/refreshToken', new UserController().RefreshToken);

routes.post('/logout', new UserController().Logout);

routes.post("/recover-password/confirmation", new UserController().RecoverPasswordConfirmation);

export default routes;
