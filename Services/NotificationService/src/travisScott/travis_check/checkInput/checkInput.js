"use strict";
// generic validator / theres some libs available as alternative
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
exports.EmailClassValidator = void 0;
class EmailClassValidator {
    constructor() {
        this.emailEnforcedExpression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    }
    checkEmailFormat(email) {
        return __awaiter(this, void 0, void 0, function* () { return this.emailEnforcedExpression.test(email); });
    }
}
exports.EmailClassValidator = EmailClassValidator;
