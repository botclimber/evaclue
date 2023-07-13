import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();

routes.post("/register/user", new UserController().RegistUser);
routes.post("/login/user", new UserController().LoginUser);
routes.post("/password/:userId/", new UserController().ChangePassword);

// routes.post("/register/admin", new UserController().registAdmin);
// routes.post("/login/admin", new UserController().loginAdmin);


export default routes;
