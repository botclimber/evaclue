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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const Sub_1 = require("./src/travisScott/travis_actions/travis_tasks/travis_sub/Sub");
const date_and_time_1 = __importDefault(require("date-and-time"));
const tokenHandler_1 = require("./src/travisScott/travis_check/tokenHandler/tokenHandler");
const ContactResOwnerClass_1 = require("./src/travisScott/travis_actions/travis_tasks/travis_contactResOwner/ContactResOwnerClass");
const tokenReader_1 = require("./src/travisScott/travis_check/tokenReader/tokenReader");
const EmailEngine_1 = require("./src/travisScott/travis_actions/travis_sendEmail/EmailEngine");
const EmailTemplate_1 = require("./src/travisScott/travis_actions/travis_sendEmail/EmailTemplate");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
const port = process.env.PORT;
const v = "v1";
const service = "notification";
app.get('/', (req, res) => {
    res.send('Notification Service | API page on development ...');
});
/**
 * Create new subscription
 */
app.post("/" + service + "/" + v + "/sub", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. input checking [done]
    // 2. insert in DB [done]
    // 3. send notification email
    try {
        const email = req.body.email;
        if (email) {
            const sub = new Sub_1.Subs(email);
            yield sub.createSub(res);
        }
        else {
            res.status(400).json({ msg: "Missing email parameter!" });
        }
    }
    catch (e) {
        //res.status(500).json({"error": e})
        console.log(e);
        res.status(500).json("Some Internal Error");
    }
}));
/**
 * Send email to residence owner from user
 * owner email should preferencial be hidden from common user (send it to front end encrypted)
 *
 *
 */
app.post("/" + service + "/" + v + "/emToOwner", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. check token [done]
        const data = yield (0, tokenHandler_1.tokenHandler)(req);
        // 2. check body parameters
        if ((!data.userName || data.userName == "") || (!data.message || data.message == "") || (!data.resOwnerEmail || data.resOwnerEmail == "") || (!data.resOwnerId) || (!data.userId))
            res.status(400).json({ msg: "Missing some required parameters!" });
        else {
            // 3. get email from encrypted
            const emailTo = yield (0, tokenReader_1.tokenReader)(data.resOwnerEmail);
            const cro = { resOwnerId: data.resOwnerId, userId: data.userId, resOwnerEmail: emailTo, userEmail: data.email, userName: data.userName, createdAt: date_and_time_1.default.format(new Date(), "YYYY/MM/DD HH:mm:ss"), message: data.message };
            const croClass = new ContactResOwnerClass_1.ContactResOwnerClass(cro);
            // 4. send email to res owner
            const html = EmailTemplate_1.EmailTemplate.forContactResOwner(cro);
            const subject = "Evaclue: Someone is trying to get in touch with!";
            const emailForm = { to: cro.resOwnerEmail, from: data.email, subject: subject, html: html };
            const emailEngine = new EmailEngine_1.EmailEngine(emailForm);
            const status = yield emailEngine.send();
            if (status) {
                // 5. create record on contactResOwner table
                // 6. send feedback to user on web page
                yield croClass.createContact(res);
            }
            else
                // send response with error message
                res.status(500).json({ msg: "Something went wrong when trying to send email ?!" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json("Some Internal Error");
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
