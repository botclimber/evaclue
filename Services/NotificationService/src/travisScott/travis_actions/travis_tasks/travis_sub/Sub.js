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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subs = void 0;
const Db_1 = require("../../../../Db/Db");
const date_and_time_1 = __importDefault(require("date-and-time"));
const fs_1 = __importDefault(require("fs"));
const EmailTemplate_1 = require("../../travis_sendEmail/EmailTemplate");
const EmailEngine_1 = require("../../travis_sendEmail/EmailEngine");
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
    createSub(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = new Db_1.Db();
            try {
                // check if email already exists
                const getOne = yield db.selectOne(this.sub, this.className);
                if (getOne.length) {
                    console.log(`Email ${this.sub.email} exists!`);
                    res.status(400).json({ "msg": "Email already existing!" });
                }
                else {
                    const result = yield db.insert(this.sub, this.className);
                    console.log(result, typeof (result));
                    if (result) {
                        const subject = "Thanks for subscribing!";
                        const html = EmailTemplate_1.EmailTemplate.forSubscription();
                        const emailForm = { to: this.sub.email, subject: subject, html: html };
                        new EmailEngine_1.EmailEngine(emailForm).send();
                        res.status(200).json({ "msg": "Email subscribed, thanks!" });
                    }
                }
            }
            catch (e) {
                console.log(e);
                throw (e);
            }
        });
    }
    /**
     * Saves information in .csv file | only for the cases where DB not available
     * For test and alternative purposes only
     *
     * @param res
     */
    createSubToCSV(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if email already exists
                fs_1.default.readFile("emails.csv", "utf-8", (err, data) => {
                    console.log(this.sub.email);
                    if (err)
                        console.log(err);
                    else {
                        const checkEmail = data.includes(this.sub.email);
                        if (!checkEmail) {
                            fs_1.default.writeFile("emails.csv", data + `${this.sub.email},${this.sub.createdAt}\n`, (err) => {
                                if (err) {
                                    console.log(err);
                                    throw "somehthing went wrong!";
                                }
                                else {
                                    fs_1.default.close;
                                    res.status(200).json({ "msg": "row created, thanks!" });
                                }
                            });
                        }
                        else
                            // email already registed
                            res.status(400).json({ msg: "Email already existing!" });
                    }
                });
            }
            catch (e) {
                console.log(e);
                throw (e);
            }
        });
    }
}
exports.Subs = Subs;
