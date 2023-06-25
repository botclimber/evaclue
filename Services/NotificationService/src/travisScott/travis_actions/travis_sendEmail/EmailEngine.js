"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailEngine = void 0;
const nodemailer = require("nodemailer");
class EmailEngine {
    constructor(data) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        this.mailOptions = data;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Sending Email ...");
                console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASS);
                console.log(this.mailOptions);
                const status = yield this.transporter.sendMail(this.mailOptions);
                console.log("Email sent");
                console.log(status);
                if (status.accepted.length)
                    return true;
                return false;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
}
exports.EmailEngine = EmailEngine;
