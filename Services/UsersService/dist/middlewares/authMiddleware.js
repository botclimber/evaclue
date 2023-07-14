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
function deToken(token) { return jsonwebtoken_1.default.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo"); }
const authMiddleware = async (req, res, next) => {
    console.log(req);
    const { authorization } = req.headers;
    if (!authorization) {
        throw new ErrorTypes_1.Unauthorized(Constants_1.ErrorMessages.USER_NOT_AUTHORIZED);
    }
    const token = authorization.split(" ")[1];
    const { userId, userEmail, userType } = deToken(token);
    if (!userId) {
        throw new ErrorTypes_1.Unauthorized(Constants_1.ErrorMessages.USER_NOT_AUTHORIZED);
    }
    const user = await UserRepository_1.UserRepository.FindOneById(userId);
    if (!user) {
        throw new ErrorTypes_1.Unauthorized(Constants_1.ErrorMessages.USER_NOT_AUTHORIZED);
    }
    next();
};
exports.authMiddleware = authMiddleware;
