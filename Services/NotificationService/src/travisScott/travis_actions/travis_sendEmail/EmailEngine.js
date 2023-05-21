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
        var _a;
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
        // setup format
        // if from exists it means communication between foreing people, otherwise it can be a notification email only.
        const mOptions = (data.from) ? Object.assign(data, { cc: data.from, envelope: { from: data.from, to: data.to } }) : Object.assign(data, { from: "" });
        // replace from with server email
        mOptions.from = (_a = process.env.SMTP_EMAIL) !== null && _a !== void 0 ? _a : "???";
        console.log("From email assignment: " + mOptions.from, mOptions);
        // assign
        this.mailOptions = mOptions;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.sendMail(this.mailOptions);
                // if no exception we can assume that the mail was sent
                return true;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
}
exports.EmailEngine = EmailEngine;
