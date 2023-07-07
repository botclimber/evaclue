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
exports.NotifyUsers = void 0;
const EmailTemplate_1 = require("../../sendEmail/EmailTemplate");
const EmailEngine_1 = require("../../sendEmail/EmailEngine");
class NotifyUsers {
    constructor(data) {
        this.className = "NotifyUsers";
        this.usersToBeNotified = data;
    }
    sendEmailToUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Sending notification email to all users ...");
                this.usersToBeNotified.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                    // get resOwner email
                    const subject = "We found some available Rents that suits you";
                    const html = EmailTemplate_1.EmailTemplate.forNotificationOfAvailableRents(element);
                    const emailForm = { from: process.env.SMTP_EMAIL || "???", to: element.toEmail, subject: subject, html: html };
                    const instanceOfEmail = new EmailEngine_1.EmailEngine(emailForm);
                    yield instanceOfEmail.send();
                }));
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
}
exports.NotifyUsers = NotifyUsers;
