"use strict";
// generic validator / theres some libs available as alternative
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailClassValidator = void 0;
class EmailClassValidator {
    constructor() {
        this.emailEnforcedExpression = /^[\w\.-]+@[\w\.-]+\.\w+$/i;
    }
    async checkEmailFormat(email) { return this.emailEnforcedExpression.test(email); }
}
exports.EmailClassValidator = EmailClassValidator;
