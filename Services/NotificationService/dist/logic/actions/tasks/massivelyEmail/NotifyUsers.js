"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyUsers = void 0;
const EmailTemplate_1 = require("../../sendEmail/EmailTemplate");
const EmailEngine_1 = require("../../sendEmail/EmailEngine");
class NotifyUsers {
    constructor(data) {
        this.className = "NotifyUsers";
        this.usersToBeNotified = data;
    }
    async sendEmailToUsers() {
        try {
            console.log("Sending notification email to all users ...");
            this.usersToBeNotified.forEach(async (element) => {
                // get resOwner email
                const subject = "We found some available Rents that suits you";
                const html = EmailTemplate_1.EmailTemplate.forNotificationOfAvailableRents(element);
                const emailForm = { from: process.env.SMTP_EMAIL || "???", to: element.toEmail, subject: subject, html: html };
                const instanceOfEmail = new EmailEngine_1.EmailEngine(emailForm);
                await instanceOfEmail.send();
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
}
exports.NotifyUsers = NotifyUsers;
