import { EmailForm } from "../../travis_types/typeModels";
import {transporter} from "../../../../index"

export class EmailEngine{
    private mailOptions: EmailForm

    constructor(data: EmailForm){

        // setup format
        // if from exists it means communication between foreing people, otherwise it can be a notification email only.
        const mOptions: EmailForm = (data.from)? Object.assign(data, {cc: data.from, envelope: {from: data.from, to: data.to}}) : Object.assign(data, {from: ""})
        
        // replace from with server email
        mOptions.from = process.env.SMTP_EMAIL ?? "???"
        
        // assign
        this.mailOptions = mOptions
    }

    async send(): Promise<void>{

        try{
            console.log("Sending Email ...")
            console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASS)
            console.log(this.mailOptions)
            
            transporter.sendMail(this.mailOptions, (error: any, info: any) => {
              if (error) {
                console.error(error);

              } else {
                console.log('Email sent: ' + info.response);
                console.log('Email sent successfully');
              }
            });
        
        }
        catch(e){
            console.log(e)
        }
    }
}