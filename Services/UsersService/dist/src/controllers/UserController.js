"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const date_and_time_1 = __importDefault(require("date-and-time"));
const userRepository_1 = require("../../database/src/repositories/userRepository");
const constants_1 = require("../helpers/constants");
const errorTypes_1 = require("../helpers/errorTypes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const emailHelper_1 = require("../helpers/emailHelper");
/**
 * @method _updateImgDB     update image name on Data Base
 * @method _generateImgCode generate some random name for uploaded file in order to not have naming conflicts
 */
class UserControllerHelper {
    /**
     *
     * @param finalFileName
     * @param userId
     */
    async _updateImgDB(finalFileName, userId) {
        const user = await userRepository_1.userRepository.findOneBy({ id: +userId });
        if (user) {
            user.image = finalFileName;
            await userRepository_1.userRepository.save(user);
        }
        else {
            throw new errorTypes_1.BadRequest("User does not exist");
        }
    }
    /**
     *
     * @param fileName
     * @returns
     */
    async _generateImgCode(fileName) {
        const max = 1000;
        const min = 1;
        return fileName.replaceAll(".", "") + Math.floor(Math.random() * (max - min + 1) + min).toString() + ".gif";
    }
}
class UserController extends UserControllerHelper {
    constructor() { super(); }
    async registCommon(req, res, next) {
        const { firstName, lastName, password, email, username } = req.body;
        const type = "common";
        console.log(`Registration Request for email: ${email}`);
        const userExists = await userRepository_1.userRepository.findOneBy({ email });
        if (userExists)
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.USER_ALREADY_EXISTS);
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = userRepository_1.userRepository.create({
            image: "default.gif",
            firstName,
            lastName,
            password: hashedPassword,
            email,
            username,
            type
        });
        await userRepository_1.userRepository.save(newUser);
        console.log(`Registration Successful for email: ${email}`);
        emailHelper_1.EmailHelper.sendVerifyEmail(newUser);
        console.log(`Sending verification email to: ${email}`);
        const { password: _, ...user } = newUser;
        return res.status(201).json(user); // return token ? or just regist status ?
    }
    async registSpecial(req, res, next) {
        var _a, _b;
        const { firstName, lastName, password, email, username, type } = req.body;
        const specFields = [firstName, lastName, password, email, username, type];
        specFields.forEach(field => { if (field === "") {
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.ALL_REQUIRED);
        } });
        console.log(`Registration Request for email: ${email}`);
        const userExists = await userRepository_1.userRepository.findOneBy({ email });
        if (userExists)
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.USER_ALREADY_EXISTS);
        const token = ((_a = req.headers['r-access-token']) !== null && _a !== void 0 ? _a : "");
        if (!token)
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.TOKEN_REQUIRED);
        try {
            const decToken = jsonwebtoken_1.default.verify(token, (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : "");
            const admin = await userRepository_1.userRepository.findOneBy({ id: decToken.userId });
            if ((admin.type == "admin" || admin.type == "superAdmin") && !admin.blocked) {
                const hashedPassword = await bcrypt_1.default.hash(password, 10);
                const newUser = userRepository_1.userRepository.create({
                    image: "default.gif",
                    firstName,
                    lastName,
                    password: hashedPassword,
                    email,
                    username,
                    type
                });
                await userRepository_1.userRepository.save(newUser);
                console.log(`Registration Successful for email: ${email}`);
                emailHelper_1.EmailHelper.sendVerifyEmail(newUser);
                console.log(`Sending verification email to: ${email}`);
                const { password: _, ...user } = newUser;
                return res.status(201).json(user);
            }
            else
                throw new errorTypes_1.Unauthorized(constants_1.ErrorMessages.ADMIN_NOT_FOUND);
        }
        catch (e) {
            console.log(e);
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.INVALID_TOKEN);
        }
    }
    async loginPlatform(req, res, next) {
        var _a;
        const { password, email } = req.body;
        console.log(`Login Request for email: ${email}`);
        const user = await userRepository_1.userRepository.findOneBy({ email });
        if (!user) {
            console.log("INVALID EMAIL");
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
        }
        const verifyPassword = await bcrypt_1.default.compare(password, user.password);
        if (!verifyPassword) {
            console.log("WRONG PASSWORD");
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, userEmail: user.email, userType: user.type }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "", {
            expiresIn: "24h",
        });
        const { password: _, ...userLogin } = user;
        console.log(`Login Successful for email: ${email}`);
        return res.status(200).json({ user: { uImage: userLogin.image, uId: userLogin.id, firstName: userLogin.firstName, lastName: userLogin.lastName, userEmail: userLogin.email, userType: userLogin.type, expTime: date_and_time_1.default.format(new Date(), "DD/MM/YYYY") }, token: token });
    }
    async loginAdmin(req, res, next) {
        var _a;
        const { password, email } = req.body;
        console.log(`Login Request for email: ${email}`);
        const user = await userRepository_1.userRepository.findOneBy({ email });
        if (!user) {
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
        }
        const verifyPassword = await bcrypt_1.default.compare(password, user.password);
        if (!verifyPassword) {
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
        }
        if (user.type == "common")
            throw new errorTypes_1.Unauthorized(constants_1.ErrorMessages.NO_PERMISSION);
        const token = jsonwebtoken_1.default.sign({ userId: user.id, userEmail: user.email, userType: user.type }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "", {
            expiresIn: "24h",
        });
        const { password: _, ...userLogin } = user;
        console.log(`Login Successful for email: ${email}`);
        return res.status(200).json({ user: { uImage: userLogin.image, uId: userLogin.id, firstName: userLogin.firstName, lastName: userLogin.lastName, userEmail: userLogin.email, userType: userLogin.type, expTime: date_and_time_1.default.format(new Date(), "DD/MM/YYYY") }, token: token });
    }
    async getProfile(req, res, next) {
        return res.status(200).json(req.user);
    }
    // token in the url is a huge mistake, for now i will just workaround it
    async verifyUser(req, res, next) {
        var _a;
        let { userId, token } = req.params;
        console.log(`verifyUser Request for userId: ${userId}`);
        const user = await userRepository_1.userRepository.findOneBy({ id: +userId });
        if (!user) {
            throw new errorTypes_1.BadRequest("User does not exist");
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token.replaceAll("=", ''), (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : ""); // if token wrong then triggers the catch exception
            console.log(decodedToken);
            user.verified = true;
            await userRepository_1.userRepository.save(user);
            console.log(`User with ID ${userId} verified`);
            return res.status(200).json(req.user);
        }
        catch (e) {
            console.log("Exception: " + e);
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.INVALID_TOKEN);
        }
    }
    // TODO: have a proper look on this method
    async changePasswordRequest(req, res, next) {
        let { email } = req.params;
        console.log(`changePasswordRequest Request for email: ${email}`);
        const user = await userRepository_1.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new errorTypes_1.BadRequest("User does not exist");
        }
        emailHelper_1.EmailHelper.sendChangePasswordEmail(user);
        console.log(`Send password reset email to: ${email}`);
        return res.status(200).json(req.user);
    }
    // TODO:
    // - have look on this method and adapt it (add try catch scope for token verification)
    async updateUserPassword(req, res, next) {
        var _a;
        let { userId, emailToken } = req.params;
        console.log(`updateUserPassword Request for userId: ${userId}`);
        const user = await userRepository_1.userRepository.findOneBy({ id: +userId });
        if (!user) {
            throw new errorTypes_1.BadRequest("User does not exist");
        }
        const decode = jsonwebtoken_1.default.verify(emailToken, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : ""); // whats the purpose of this line ?
        const { password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        user.password = hashedPassword;
        console.log("Sucessfully updated password");
        await userRepository_1.userRepository.save(user);
        return res.status(200).json({ msg: "updated  " });
    }
    // TODO: create method to change password with old password verification
    async manualPasswordChange(req, res, next) {
        var _a;
        let { userId, token } = req.params;
        console.log(`manualPasswordChange Request for userId: ${userId}`);
        const user = await userRepository_1.userRepository.findOneBy({ id: +userId });
        if (!user) {
            throw new errorTypes_1.BadRequest("User does not exist");
        }
        const decode = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : ""); // whats the purpose of this line ?
        const { oldPassword, newPassword } = req.body;
        const vPass = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!vPass)
            throw new errorTypes_1.BadRequest(constants_1.ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        console.log("Sucessfully updated password");
        await userRepository_1.userRepository.save(user);
        return res.status(200).json({ message: "Password changed!" });
    }
    /**
     * Method that updates user profile image
     *
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async updateProfileImg(req, res, next) {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ message: "No file sent!" });
            }
            else {
                console.log("file recieved!");
                const recFile = req.files.userImg;
                //const genFileName: string = await super._generateImgCode(recFile.name)
                const uploadPath = process.env.DIRNAME;
                console.log("Updating image on DataBase ...");
                if (req.user.id) {
                    const fileName = "user-" + req.user.id.toString() + ".gif";
                    await super._updateImgDB(fileName, req.user.id);
                    console.log("moving file ... " + uploadPath + fileName);
                    recFile.mv(uploadPath + fileName, (err) => {
                        if (err)
                            return res.status(400).json({ message: "some error occurred" + err });
                        return res.status(200).json({ message: "Image uploaded with success!", img: fileName });
                    });
                }
                else {
                    return res.status(400).json({ message: "User id not found!" });
                }
            }
        }
        catch (e) {
            throw e;
        }
    }
}
exports.UserController = UserController;
