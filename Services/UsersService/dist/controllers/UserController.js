"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
require("dotenv/config");
const UserService_1 = __importDefault(require("../services/UserService"));
class UserController {
    async RegistUser(req, res, next) {
        const user = req.body;
        // Call to service layer.
        // Abstraction on how to access the data layer and the business logic.
        await UserService_1.default.Register(user, "common");
        return res.status(201); // return token ? or just regist status ?
    }
    async Teste(req, res, next) {
        console.log(req.user);
        console.log("teste");
        return res.status(200).json({ msg: "updated  " });
    }
    async RefreshToken(req, res, next) {
        const { refreshToken } = req.cookies;
        console.log("refreshing token: " + refreshToken);
        const accessToken = await UserService_1.default.RefreshToken(refreshToken);
        return res.status(200).json({ access_token: accessToken });
    }
    async Logout(req, res, next) {
        console.log(req.cookies);
        res.clearCookie("refreshToken");
        res.end();
        return res.status(200);
    }
    async LoginUser(req, res, next) {
        console.log("entrooo !");
        const user = req.body;
        const { acessToken, refreshToken } = await UserService_1.default.Login(user);
        res.cookie("refreshToken", refreshToken, {
            maxAge: 3.123e10,
            httpOnly: true,
        });
        return res.status(200).json(acessToken);
    }
    async VerifyUser(req, res, next) {
        let { userId, token } = req.params;
        token = await UserService_1.default.VerifyUser(userId, token);
        return res.status(200).json(token);
    }
    async RecoverUserPasswordEmailRequest(req, res, next) {
        let { email } = req.params;
        const user = UserService_1.default.RecoverUserPasswordEmailRequest(email);
        return res.status(200).json(user);
    }
    async ChangePassword(req, res, next) {
        let { userId } = req.params;
        let { password, oldPassword } = req.body;
        UserService_1.default.ChangePassword(userId, oldPassword, password);
        return res.status(200).json({ msg: "updated  " });
    }
    async RecoverPasswordConfirmation(req, res, next) {
        let { password, token } = req.body;
        UserService_1.default.ChangePasswordWithToken(token, password);
        return res.status(200).json({ msg: "updated  " });
    }
}
exports.UserController = UserController;
