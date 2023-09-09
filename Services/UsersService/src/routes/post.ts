import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();

routes.post("/register", new UserController().RegistUser);
routes.post("/login", new UserController().LoginUser);

routes.get(
    "/recover-password/request/:email",
    new UserController().RecoverUserPasswordEmailRequest
);

routes.get('/teste', authMiddleware, new UserController().Teste);

routes.post('/refreshToken', new UserController().RefreshToken);

routes.post('/logout', new UserController().Logout);


//routes.post("/change-password/:userId", new UserController().ChangePassword);
routes.post("/recover-password/confirmation", new UserController().RecoverPasswordConfirmation);

routes.get("/verify/:userId/:token", new UserController().VerifyUser);

// routes.post("/register/admin", new UserController().registAdmin);
// routes.post("/login/admin", new UserController().loginAdmin);


export default routes;
