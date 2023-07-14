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
const EmailService_1 = require("../services/EmailService");
const UserRepository_1 = require("../database/UserRepository");
class UserService {
    static async Register(user, type) {
        user.type = type;
        console.log(`Registration Request for email: ${user.email}`);
        const userExists = await UserRepository_1.UserRepository.FindOneByEmail(user.email);
        if (userExists)
            throw new ErrorTypes_1.BadRequest(Constants_1.ErrorMessages.USER_ALREADY_EXISTS);
        const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
        user.password = hashedPassword;
        user = await UserRepository_1.UserRepository.Create(user);
        EmailService_1.EmailService.SendVerifyEmail(user);
        console.log(`Sending verification email to: ${user.email}`);
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
        console.log(`Login Successful for email: ${userFound.email} `);
        return token;
    }
    static async VerifyUser(userId, token) {
        //const { userId } = await UserService.ParseToken(token)
        console.log(`verifyUser Request for userId: ${userId}`);
        const user = await UserRepository_1.UserRepository.FindOneById(+userId);
        //maybe have a token value in the user table
        if (!user) {
            throw new ErrorTypes_1.BadRequest("User does not exist");
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo"); // if token wrong then triggers the catch exception
            console.log(decodedToken);
            user.verified = true;
            await UserRepository_1.UserRepository.Update(user);
            console.log(`User with ID ${userId} verified`);
            return token;
        }
        catch (e) {
            console.log("Exception: " + e);
            throw new ErrorTypes_1.BadRequest(Constants_1.ErrorMessages.INVALID_TOKEN);
        }
    }
    static async ParseToken(token) {
        return jsonwebtoken_1.default.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo");
    }
    static async ChangePasswordWithToken(userId, emailToken, password) {
        var _a;
        console.log(`updateUserPassword Request for userId: ${userId}`);
        const user = await UserRepository_1.UserRepository.FindOneById(+userId);
        if (!user) {
            throw new ErrorTypes_1.BadRequest("User does not exist");
        }
        const decode = jsonwebtoken_1.default.verify(emailToken, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : ""); // whats the purpose of this line ? R.:Check if token exists to see if the request is valid
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        user.password = hashedPassword;
        console.log("Sucessfully updated password");
        await UserRepository_1.UserRepository.Update(user);
    }
    static async ChangePassword(userId, oldPassword, password) {
        console.log(`updateUserPassword Request for userId: ${userId}`);
        // Check if this is needed (dont let user see if email exists or not)
        const user = await UserRepository_1.UserRepository.FindOneById(+userId);
        if (!user) {
            throw new ErrorTypes_1.BadRequest("User does not exist");
        }
        const verifyPassword = await bcrypt_1.default.compare(user.password, oldPassword);
        if (!verifyPassword) {
            console.log("WRONG PASSWORD");
            throw new ErrorTypes_1.BadRequest(Constants_1.ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        user.password = hashedPassword;
        console.log("Sucessfully updated password");
        await UserRepository_1.UserRepository.Update(user);
    }
    static async ForgotUserPasswordRequest(email) {
        console.log(`changePasswordRequest Request for email: ${email}`);
        const user = await UserRepository_1.UserRepository.FindOneByEmail(email);
        if (!user) {
            throw new ErrorTypes_1.BadRequest("User does not exist");
        }
        EmailService_1.EmailService.SendChangePasswordEmail(user);
        console.log(`Send password reset email to: ${email}`);
        return user;
    }
}
exports.default = UserService;
