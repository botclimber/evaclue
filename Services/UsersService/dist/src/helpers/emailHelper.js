"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHelper = void 0;
const server_1 = require("../server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
class EmailHelper {
    static async sendVerifyEmail(user) {
        var _a;
        const currentURL = `${process.env.HOST}:${process.env.users_PORT}`;
        // process.env.SECRET ?? "" can lead to security breach
        const token = jsonwebtoken_1.default.sign({ userId: user.id, userEmail: user.email, userType: user.type }, (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "", {
            expiresIn: "1h",
        });
        const mailOptions = {
            from: "supp.evaclue@gmail.com",
            to: user.email,
            subject: "Welcome to Evaclue",
            html: `<p>Welcome to Evaclue, ${user.firstName} ${user.lastName}! Please confirm your email address clicking on the link below.</p>
          <p>Link expirers in 6 hours</p>
          <p>Click<a href="${currentURL}/user/verify/${user.id}/${token}"> here to verify.</a></p>`,
        };
        server_1.transporter.sendMail(mailOptions);
    }
    static async sendChangePasswordEmail(user) {
        var _a;
        const currentURL = `${process.env.HOST}${process.env.CLIENT_PORT}`;
        const passwordToken = jsonwebtoken_1.default.sign({ id: user.id }, (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "", {
            expiresIn: "2h",
        });
        const mailOptions = {
            from: "supp.evaclue@gmail.com",
            to: user.email,
            subject: "Change password",
            html: `<p>Hello ${user.firstName} ${user.lastName}! To change your password click on the link below.</p>
          <p>Link expires in 1 hour</p>
          <p>Click<a href="${currentURL}/changePassword/${user.id}/${passwordToken}" here</a> to change password.</p>`,
        };
        server_1.transporter.sendMail(mailOptions);
    }
}
exports.EmailHelper = EmailHelper;
