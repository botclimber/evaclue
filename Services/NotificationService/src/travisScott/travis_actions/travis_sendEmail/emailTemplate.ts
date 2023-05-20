/**
 * Email Template
 */

import { ContactResOwner, Sub } from "../../travis_types/typeModels";

export class EmailTemplate {
    static forContactResOwner(data: ContactResOwner): string{
        const html = `
        <h6>Message From ${data.userName}</h6>
        <br/>
        <hr/>
        <p>${data.message}</p>
        `
        return html
    }

    static forSubscription(): string{
        const html = `
        <p>Welcome to Rentify, Thanks for your subscription we expect to have the platform up and runnning really soon!</p>
        `
        return html
    }
}