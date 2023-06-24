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
const index_1 = require("../../../../index");
class EmailEngine {
    constructor(data) {
        var _a;
        // setup format
        // if from exists it means communication between foreing people, otherwise it can be a notification email only.
        const mOptions = (data.from) ? Object.assign(data, { cc: data.from, envelope: { from: data.from, to: data.to } }) : Object.assign(data, { from: "" });
        // replace from with server email
        mOptions.from = (_a = process.env.SMTP_EMAIL) !== null && _a !== void 0 ? _a : "???";
        // assign
        this.mailOptions = mOptions;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Sending Email ...");
                console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASS);
                console.log(this.mailOptions);
                index_1.transporter.sendMail(this.mailOptions, (error, info) => {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                        console.log('Email sent successfully');
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.EmailEngine = EmailEngine;
