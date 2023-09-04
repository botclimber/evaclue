"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactResOwnerClass = void 0;
const Db_1 = require("../../../../Db/Db");
class ContactResOwnerClass {
    constructor(resOwner) {
        this.className = "ContactResOwner";
        this.resOwner = resOwner;
    }
    async createContact(res) {
        const db = new Db_1.Db();
        try {
            // for now is not of interest to store the message on DB
            delete this.resOwner.message;
            const result = await db.insert(this.resOwner, this.className);
            console.log(result, typeof (result));
            if (result)
                res.status(200).json({ msg: "Your message was sent!" });
        }
        catch (e) {
            console.log(e);
            throw (e);
        }
    }
}
exports.ContactResOwnerClass = ContactResOwnerClass;
