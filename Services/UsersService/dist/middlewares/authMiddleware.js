"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const Constants_1 = require("../helpers/Constants");
const ErrorTypes_1 = require("../helpers/ErrorTypes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const UserRepository_1 = require("../database/UserRepository");
function deToken(token) { var _a; return jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : ""); }
const authMiddleware = async (req, res, next) => {
    console.log(req);
    const { authorization } = req.headers;
    if (!authorization) {
        throw new ErrorTypes_1.Unauthorized(Constants_1.ErrorMessages.USER_NOT_AUTHORIZED);
    }
    const token = authorization.split(" ")[1];
    const { userId, userEmail, userType } = deToken(token);
    const user = await UserRepository_1.UserRepository.FindOneById(userId);
    if (!user) {
        throw new ErrorTypes_1.Unauthorized(Constants_1.ErrorMessages.USER_NOT_AUTHORIZED);
    }
    const { password: _, ...loggedUser } = user;
    //req.user = loggedUser;
    next();
};
exports.authMiddleware = authMiddleware;
