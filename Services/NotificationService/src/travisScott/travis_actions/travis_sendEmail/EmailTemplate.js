"use strict";
/**
 * Email Template
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplate = void 0;
class EmailTemplate {
    static forContactResOwner(data) {
        const html = `
        <h6>Message From ${data.userName}</h6>
        <br/>
        <hr/>
        <p>${data.message}</p>
        `;
        return html;
    }
    static forSubscription() {
        const html = `
        <p>Welcome to Rentify, Thanks for your subscription we expect to have the platform up and runnning really soon!</p>
        `;
        return html;
    }
}
exports.EmailTemplate = EmailTemplate;
