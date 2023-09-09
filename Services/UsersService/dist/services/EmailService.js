"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const app_1 = require("../app");
require("dotenv/config");
const EmailVerificationTokensRepository_1 = require("../database/EmailVerificationTokensRepository");
const jwtUtilities_1 = require("../utils/jwtUtilities");
class EmailService {
    static async SendVerifyEmail(user) {
        const currentURL = `localhost:7000`;
        const token = (0, jwtUtilities_1.generateAcessToken)(user);
        let emailVerificationTokensInstance = { token: token, userId: user.id };
        await EmailVerificationTokensRepository_1.EmailVerificationTokensRepository.Create(emailVerificationTokensInstance);
        const mailOptions = {
            from: "supp.evaclue@gmail.com",
            to: user.email,
            subject: "Welcome to Evaclue",
            html: `<p>Welcome to Evaclue, ${user.firstName} ${user.lastName}! Please confirm your email address clicking on the link below.</p>
          <p>Link expires in 6 hours</p>
          <p>Click<a href="http://${currentURL}/user/verify/${user.id}/${token}"> here to verify.</a></p>`,
        };
        app_1.transporter.sendMail(mailOptions);
    }
    static async SendChangePasswordEmail(user) {
        const currentURL = `localhost:8011`;
        const token = (0, jwtUtilities_1.generateAcessToken)(user);
        const mailOptions = {
            from: "supp.evaclue@gmail.com",
            to: user.email,
            subject: "Change password",
            html: `<p>Hello ${user.firstName} ${user.lastName}! To change your password click on the link below.</p>
          <p>Link expires in 1 hour</p>
          <p>Click<a href="http://${currentURL}/user/recover-password/confirmation/${token}" here</a> to change password.</p>`,
        };
        app_1.transporter.sendMail(mailOptions);
    }
}
exports.EmailService = EmailService;
