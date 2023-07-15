"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const app_1 = require("../app");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
class EmailService {
    static async SendVerifyEmail(user) {
        const currentURL = `localhost:7000`;
        // process.env.JWT_SECRET ?? "" can lead to security breach
        const token = jsonwebtoken_1.default.sign({ userId: user.id, userEmail: user.email, userType: user.type }, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo", {
            expiresIn: "1h",
        });
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo", {
            expiresIn: "2h",
        });
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
