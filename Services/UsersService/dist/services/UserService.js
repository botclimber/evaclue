"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../helpers/Constants");
const ErrorTypes_1 = require("../helpers/ErrorTypes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const EmailHelper_1 = require("../helpers/EmailHelper");
const UserRepository_1 = require("../database/UserRepository");
class UserService {
    static async Register(user) {
        user.type = "common";
        console.log(`Registration Request for email: ${user.email}`);
        const userExists = await UserRepository_1.UserRepository.FindOneByEmail(user.email);
        if (userExists)
            throw new ErrorTypes_1.BadRequest(Constants_1.ErrorMessages.USER_ALREADY_EXISTS);
        const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
        user.password = hashedPassword;
        user = await UserRepository_1.UserRepository.Create(user);
        EmailHelper_1.EmailHelper.sendVerifyEmail(user);
        console.log(`Sending verification email to: ${user.email}`);
        //const { password: _, ...user } = newUser;
    }
    static async Login(user) {
        console.log(`Login Request for email: ${user.email}`);
        const userFound = await UserRepository_1.UserRepository.FindOneByEmail(user.email);
        if (!userFound) {
            console.log("INVALID EMAIL");
            throw new ErrorTypes_1.BadRequest(Constants_1.ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
        }
        const verifyPassword = await bcrypt_1.default.compare(user.password, userFound.password);
        if (!verifyPassword) {
            console.log("WRONG PASSWORD");
            throw new ErrorTypes_1.BadRequest(Constants_1.ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
        }
        const token = jsonwebtoken_1.default.sign({ userId: userFound.id, userEmail: userFound.email, userType: userFound.type }, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE4Mjk3NiwiaWF0IjoxNjg5MTgyOTc2fQ.GUGr_MNFADIZZUG8CPb0BIPArnz_Mw4W_Mzjz2bU-v4", {
            expiresIn: "24h",
        });
        //const { password: _, ...userLogin } = user;
        console.log(`Login Successful for email: ${userFound.email} `);
        return token;
    }
}
exports.default = UserService;
