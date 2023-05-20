import { ThrowStatement } from "typescript";
import { EmailForm } from "../../travis_types/typeModels";
const nodemailer = require("nodemailer")

export class EmailEngine{
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

    private mailOptions: EmailForm

    constructor(data: EmailForm){
        // setup format
        // if from exists it means communication between foreing people, otherwise it can be a notification email only.
        const mOptions: EmailForm = (data.from)? Object.assign(data, {cc: data.from, envelope: {from: data.from, to: data.to}}) : Object.assign(data, {from: ""})
        
        // replace from with server email
        mOptions.from = process.env.SMTP_EMAIL ?? "???"
        console.log("From email assignment: "+mOptions.from, mOptions)
        
        // assign
        this.mailOptions = mOptions
    }

    async send(): Promise<boolean>{

        try{
            await this.transporter.sendMail(this.mailOptions)

            // if no exception we can assume that the mail was sent
            return true
        
        }
        catch(e){
            console.log(e)
            throw e
        }
    }
}