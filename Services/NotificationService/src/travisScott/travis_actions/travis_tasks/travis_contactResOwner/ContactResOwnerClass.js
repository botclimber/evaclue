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
exports.ContactResOwnerClass = void 0;
const Db_1 = require("../../../../Db/Db");
class ContactResOwnerClass {
    constructor(resOwner) {
        this.className = "ContactResOwner";
        this.resOwner = resOwner;
    }
    createContact(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = new Db_1.Db();
            try {
                // for now is not of interest to store the message on DB
                delete this.resOwner.message;
                const result = yield db.insert(this.resOwner, this.className);
                console.log(result, typeof (result));
                if (result)
                    res.status(200).json({ message: "Your message was sent!" });
            }
            catch (e) {
                console.log(e);
                throw (e);
            }
        });
    }
}
exports.ContactResOwnerClass = ContactResOwnerClass;
