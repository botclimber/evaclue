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
const EmailVerificationTokensRepository_1 = require("../database/EmailVerificationTokensRepository");
const jwtUtilities_1 = require("../utils/jwtUtilities");
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
        delete userFound.password;
        console.log(`Login Successful for email: ${userFound.email} `);
        const acessToken = (0, jwtUtilities_1.generateAcessToken)(user);
        const refreshToken = (0, jwtUtilities_1.generateRefreshToken)(user);
        return { acessToken, refreshToken };
    }
    static async RefreshToken(refreshToken) {
        if (refreshToken == null)
            throw new ErrorTypes_1.Forbidden(Constants_1.ErrorMessages.INVALID_TOKEN);
        let user = (0, jwtUtilities_1.verifyToken)(refreshToken);
        if (!user) {
            throw new ErrorTypes_1.Unauthorized(Constants_1.ErrorMessages.USER_DOES_NOT_EXIST);
        }
        user = (await UserRepository_1.UserRepository.FindOneByEmail(user.email));
        delete user.password;
        const accessToken = (0, jwtUtilities_1.generateAcessToken)(user);
        return accessToken;
    }
    static async VerifyUser(userId, token) {
        console.log(`verifyUser Request for userId: ${userId}`);
        const user = await UserRepository_1.UserRepository.FindOneById(+userId);
        if (!user) {
            throw new ErrorTypes_1.BadRequest("User does not exist");
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // if token wrong then triggers the catch exception
            const emailVerificationToken = await EmailVerificationTokensRepository_1.EmailVerificationTokensRepository.FindLast();
            // Should only verify last token since user can click multiple times to resend email
            if (!emailVerificationToken ||
                emailVerificationToken.token != decodedToken) {
                throw new ErrorTypes_1.BadRequest("Token does not exist");
            }
            console.log(decodedToken);
            user.verified = true;
            await UserRepository_1.UserRepository.Update(user);
            console.log(`User with ID ${userId} verified`);
            // After verification, remove all email verification tokens generated for that user
            await EmailVerificationTokensRepository_1.EmailVerificationTokensRepository.Remove(+userId);
            return decodedToken;
        }
        catch (e) {
            console.log("Exception: " + e);
            throw new ErrorTypes_1.BadRequest(Constants_1.ErrorMessages.INVALID_TOKEN);
        }
    }
    static async ParseToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    static async ChangePasswordWithToken(token, password) {
        const { userId } = await UserService.ParseToken(token);
        console.log(`updateUserPassword Request for userId: ${userId}`);
        const user = await UserRepository_1.UserRepository.FindOneById(+userId);
        if (!user) {
            throw new ErrorTypes_1.BadRequest("User does not exist");
        }
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
    static async RecoverUserPasswordEmailRequest(email) {
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
