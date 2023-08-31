"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const userRepository_1 = require("../../database/src/repositories/userRepository");
const constants_1 = require("../helpers/constants");
const errorTypes_1 = require("../helpers/errorTypes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function deToken(token) { var _a; return jsonwebtoken_1.default.verify(token, (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : ""); }
const authMiddleware = async (req, res, next) => {
    console.log(req);
    const { authorization } = req.headers;
    if (!authorization) {
        throw new errorTypes_1.Unauthorized(constants_1.ErrorMessages.USER_NOT_AUTHORIZED);
    }
    const token = authorization.split(" ")[1];
    const { userId, userEmail, userType } = deToken(token);
    const user = await userRepository_1.userRepository.findOneById(userId);
    if (!user) {
        throw new errorTypes_1.Unauthorized(constants_1.ErrorMessages.USER_NOT_AUTHORIZED);
    }
    const { password: _, ...loggedUser } = user;
    req.user = loggedUser;
    next();
};
exports.authMiddleware = authMiddleware;
