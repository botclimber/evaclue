/**
 * Email Template
 */

import { ContactResOwner} from "../../travis_types/typeModels";

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
        <p>Welcome to Evalcue, Thanks for your subscription we expect to have the platform up and running really soon!</p>
        `
        return html
    }
}