"use strict";
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
    async send() {
        try {
            console.log("Sending Email ...");
            console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASS);
            console.log(this.mailOptions);
            const status = await this.transporter.sendMail(this.mailOptions);
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
    }
}
exports.EmailEngine = EmailEngine;
