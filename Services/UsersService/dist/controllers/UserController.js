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
    async LoginUser(req, res, next) {
        const user = req.body;
        const token = await UserService_1.default.Login(user);
        return res.status(200).json(token);
    }
    // token in the url is a huge mistake, for now i will just workaround it
    async VerifyUser(req, res, next) {
        //const { authorization } = req.headers;
        let { userId, token } = req.params;
        token = await UserService_1.default.VerifyUser(userId, token);
        return res.status(200).json(token);
    }
    // // TODO: have a proper look on this method
    async RecoverUserPasswordEmailRequest(req, res, next) {
        let { email } = req.params;
        const user = UserService_1.default.RecoverUserPasswordEmailRequest(email);
        return res.status(200).json(user);
    }
    // // TODO:
    // // - have look on this method and adapt it (add try catch scope for token verification)
    async ChangePassword(req, res, next) {
        let { userId } = req.params;
        let { password, oldPassword } = req.body;
        UserService_1.default.ChangePassword(userId, oldPassword, password);
        return res.status(200).json({ msg: "updated  " });
    }
    // // TODO:
    // // - have look on this method and adapt it (add try catch scope for token verification)
    async RecoverPasswordConfirmation(req, res, next) {
        let { password, token } = req.body;
        UserService_1.default.ChangePasswordWithToken(token, password);
        return res.status(200).json({ msg: "updated  " });
    }
}
exports.UserController = UserController;
