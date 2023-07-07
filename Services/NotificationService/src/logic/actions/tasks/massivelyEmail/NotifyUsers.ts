import {AvailableRents, EmailForm} from "../../../types/typeModels"
import { EmailTemplate } from "../../sendEmail/EmailTemplate"
import { EmailEngine } from "../../sendEmail/EmailEngine"

export class NotifyUsers {
    className: string = "NotifyUsers"
    private usersToBeNotified: AvailableRents[]

    constructor(data: AvailableRents[]){
        this.usersToBeNotified = data
    }
    
    async sendEmailToUsers(){

        try {

        console.log("Sending notification email to all users ...")
        this.usersToBeNotified.forEach( async element => {
            // get resOwner email
            const subject: string = "We found some available Rents that suits you"
            const html: string = EmailTemplate.forNotificationOfAvailableRents(element)
            const emailForm: EmailForm = {from: process.env.SMTP_EMAIL || "???", to: element.toEmail, subject: subject, html: html}
            const instanceOfEmail = new EmailEngine(emailForm)

            await instanceOfEmail.send()
            
        });

        }catch(err){
            console.log(err)
            throw err
        }
    }

}