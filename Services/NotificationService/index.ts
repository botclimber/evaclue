import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import {Subs} from './src/logic/actions/travis_tasks/travis_sub/Sub'
import date from "date-and-time"

import * as types from './src/logic/types/typeModels' // interface types
import { tokenHandler } from './src/logic/checks/tokenHandler/tokenHandler';
import { ContactResOwnerClass } from './src/logic/actions/travis_tasks/travis_contactResOwner/ContactResOwnerClass';
import { tokenReader } from './src/logic/checks/tokenReader/tokenReader';
import { EmailEngine } from './src/logic/actions/travis_sendEmail/EmailEngine';
import { EmailTemplate } from './src/logic/actions/travis_sendEmail/EmailTemplate';
import { EmailClassValidator } from './src/logic/checks/checkInput/checkInput';

const app: Express = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

const port = process.env.PORT || 8002;

const v: string = "v1"
const service: string = "notifications"

app.get('/', (req: Request, res: Response) => {
  res.send('Notification Service | API page on development ...');
});

/**
 * Create new subscription
 */
app.post("/"+service+"/"+v+"/sub", async (req: Request, res: Response) => {
  
  // 1. input checking [done]
  //    1.1 TODO: check maybe by using pattern if its really an email format 
  // 2. insert in DB [done]
  // 3. send notification email
  try{
    const email: string = req.body.email
    const validEmail: boolean = await new EmailClassValidator().checkEmailFormat(email)

    if(email && validEmail){
      const sub: Subs = new Subs(email)
      await sub.createSubToCSV(res)
    
    }else {
      res.status(400).json({msg: "No email given or written in a wrong format"})
    }
    
  }catch (e){
    //res.status(500).json({"error": e})
    console.log(e)
    res.status(500).json({msg:"Some Internal Error"})
  }

});

/**
 * Send email to residence owner from user
 * owner email should preferencial be hidden from common user (send it to front end encrypted)
 * 
 * Required parameters:
 *  - userName, message, resOwnerEmail, userId, resOwnerId
 * 
 */ 
app.post("/"+service+"/"+v+"/emToOwner", async (req: Request, res: Response) => {

  try{

    // 1. check token [done]
    const data: Omit<types.CROPlusUser, "cId" | "userEmail" | "createdAt"> = await tokenHandler<Omit<types.ContactResOwner, "cId" | "createdAt" | "userEmail">>(req)

    // 2. check body parameters
    if( (!data.userName || data.userName == "") || (!data.message || data.message == "") || (!data.resOwnerEmail || data.resOwnerEmail == "") || (!data.resOwnerId) || (!data.userId)) 
      res.status(400).json({msg: "Missing some required parameters!"})
    
    else{

      // 3. get email from encrypted
      const emailTo: string = await tokenReader<string>(data.resOwnerEmail)
      console.log(emailTo)

      const cro: types.ContactResOwner = {resOwnerId: data.resOwnerId, userId: data.userId, resOwnerEmail: emailTo, userEmail: data.email, userName: data.userName, createdAt: date.format(new Date(), "YYYY/MM/DD HH:mm:ss"), message: data.message}

      const croClass: ContactResOwnerClass = new ContactResOwnerClass(cro)

      // 4. send email to res owner
      const html: string = EmailTemplate.forContactResOwner(cro)
      const subject: string = "Evaclue: Someone is trying to get in touch with!"
      const emailForm: types.EmailForm = {from: process.env.SMTP_EMAIL || "???", to: cro.resOwnerEmail, cc: data.email, subject: subject, html: html}
      const emailEngine: EmailEngine = new EmailEngine(emailForm)
      const status: boolean = await emailEngine.send()

      if(status){
        // 5. create record on contactResOwner table
        // 6. send feedback to user on web page
        await croClass.createContact(res)
        
      }else
        // send response with error message
        res.status(500).json({msg: "Something went wrong when trying to send email ?!"})
    }

  }catch(err){
    console.log(err); 
    res.status(500).json({msg:"Some Internal Error"})
  }

});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

