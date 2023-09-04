"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subs = void 0;
const Db_1 = require("../../../../Db/Db");
const date_and_time_1 = __importDefault(require("date-and-time"));
const fs_1 = __importDefault(require("fs"));
const EmailTemplate_1 = require("../../sendEmail/EmailTemplate");
const EmailEngine_1 = require("../../sendEmail/EmailEngine");
class Subs {
    constructor(email) {
        this.className = "Subs";
        // order matters
        this.sub = {
            email: email,
            createdAt: date_and_time_1.default.format(new Date(), "YYYY/MM/DD HH:mm:ss")
        };
    }
    /**
     * Saves information in Database
     *
     * @param res
     */
    async createSub(res) {
        const db = new Db_1.Db();
        try {
            // check if email already exists
            const getOne = await db.selectAll("Subs", `email = '${this.sub.email}'`);
            if (getOne.length) {
                console.log(`Email ${this.sub.email} exists!`);
                res.status(400).json({ "msg": "Email already existing!" });
            }
            else {
                const result = await db.insert(this.sub, this.className);
                console.log(result, typeof (result));
                if (result) {
                    const subject = "Obrigado pela sua subscrição!";
                    const html = EmailTemplate_1.EmailTemplate.forSubscription();
                    const emailForm = { from: process.env.SMTP_EMAIL || "???", to: this.sub.email, subject: subject, html: html };
                    const instanceOfEmail = new EmailEngine_1.EmailEngine(emailForm);
                    await instanceOfEmail.send();
                    res.status(200).json({ "msg": "Email subscribed, thanks!" });
                }
            }
        }
        catch (e) {
            console.log(e);
            throw (e);
        }
    }
    /**
     * Saves information in .csv file | only for the cases where DB not available
     * For test and alternative purposes only
     *
     * @param res
     */
    async createSubToCSV(res) {
        try {
            // check if email already exists
            fs_1.default.readFile("emails.csv", "utf-8", (err, data) => {
                console.log(this.sub.email);
                if (err)
                    console.log(err);
                else {
                    const checkEmail = data.includes(this.sub.email);
                    if (!checkEmail) {
                        fs_1.default.writeFile("emails.csv", data + `${this.sub.email},${this.sub.createdAt}\n`, async (err) => {
                            if (err) {
                                console.log(err);
                                throw "somehthing went wrong!";
                            }
                            else {
                                fs_1.default.close;
                                const subject = "Obrigado pela sua subscrição!";
                                const html = EmailTemplate_1.EmailTemplate.forSubscription();
                                const emailForm = { from: process.env.SMTP_EMAIL || "???", to: this.sub.email, subject: subject, html: html };
                                const instanceOfEmail = new EmailEngine_1.EmailEngine(emailForm);
                                await instanceOfEmail.send();
                                res.status(200).json({ "msg": "Email subscribed, thanks!" });
                            }
                        });
                    }
                    else
                        // email already registed
                        res.status(400).json({ "msg": "Email already existing!" });
                }
            });
        }
        catch (e) {
            console.log(e);
            throw (e);
        }
    }
}
exports.Subs = Subs;
