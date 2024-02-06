import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import {Subs} from './src/logic/actions/tasks/sub/Sub'
import date from "date-and-time"
import * as eva from "eva-functional-utils"

import * as types from './src/logic/types/typeModels' // interface types
import { ContactResOwnerClass, classContactResOwnerCompanion } from './src/logic/actions/tasks/contactResOwner/ContactResOwnerClass';
import { EmailEngine } from './src/logic/actions/sendEmail/EmailEngine';
import { EmailTemplate } from './src/logic/actions/sendEmail/EmailTemplate';
import { EmailClassValidator } from './src/logic/checks/checkInput/checkInput';
import { NotifyUsers } from './src/logic/actions/tasks/massivelyEmail/NotifyUsers';
import { Filters } from './src/logic/actions/tasks/filters/Filters';
import { authMiddleware } from "../CommonUtils/src/middlewares/authMiddleware";
import  "../CommonUtils/src/types/globals";

const app: Express = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

const port = process.env.not_PORT || 8002;

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
app.post("/"+service+"/"+v+"/emToOwner", authMiddleware,async (req: Request, res: Response) => {

  // TODO: decouple code into functions
  try{

    // 1. check token [done]
    const data: types.emBody  = req.body
    console.log("recieved body: ")
    console.log(data)

    // 2. check body parameters
    if( !data.userId || eva.isEmpty(data.message) || !data.resOwnerId ) res.status(400).json({msg: "Missing some required parameters!"});
    else{

      // 3. get users data
      console.log("Getting fromUser and toUser ...")
     
      const fromUserData: types.userData = await classContactResOwnerCompanion.getUserData(data.userId);
      const toUserData: types.userData =  await classContactResOwnerCompanion.getUserData(data.resOwnerId);
    
      console.log(fromUserData)
      console.log(toUserData)

      // 4. TODO: Check if this user already tried to contact residence owner
      const checkComunication = await classContactResOwnerCompanion.checkComunication(data.userId, data.resOwnerId)

      if(checkComunication){ 
        res.status(400).json({msg: "You already tried to contact this user, wait for response!"}); 
        return ;
      }

      const cro: types.ToContact = {resOwnerId: data.resOwnerId, userId: data.userId, resOwnerEmail: toUserData.email, userEmail: fromUserData.email, userName: fromUserData.fullName, createdAt: date.format(new Date(), "YYYY/MM/DD HH:mm:ss"), message: data.message}

      const croClass: ContactResOwnerClass = new ContactResOwnerClass(cro)

      // 5. send email to res owner
      const html: string = EmailTemplate.forContactResOwner(cro)
      const subject: string = `Evaclue: ${fromUserData.fullName} is trying to reach you!`
      
      const emailForm: types.EmailForm = {from: process.env.SMTP_EMAIL || "???", to: cro.resOwnerEmail, cc: fromUserData.email, subject: subject, html: html}
      
      const emailEngine: EmailEngine = new EmailEngine(emailForm)
      
      const status: boolean = await emailEngine.send()

      if(status){
        // 6. create record on contactResOwner table
        // 7. send feedback to user on web page
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

app.post(`/${service}/${v}/notifyUsers`, async (req: Request, res: Response) => {
  try{
    const data: types.AvailableRents[] = req.body.data

    if(!data) return res.status(400).json({msg:"No available residences or user to be notified!"})
    const notifyUsers: NotifyUsers = new NotifyUsers(data)

    await notifyUsers.sendEmailToUsers()

    res.status(202).json({msg:"Notification of available rents by email process complete."})
    
  }catch(err){
    console.log(err); 
    res.status(500).json({msg:"Some Internal Error"})
  }
})

app.post(`/${service}/${v}/setFilters`, authMiddleware, async (req: Request, res: Response) => {
  try{
    const data: types.UserFilters & middlewareTypes.JwtPayload = req.body
    const filters: Filters = new Filters(data, res)

    await filters.setFilters()
    
  }catch(err){
    console.log(err); 
    res.status(500).json({msg: err})
  }
})

app.get(`/${service}/${v}/getFilters`, authMiddleware, async (req: Request, res: Response) => {
  try{
    const data: types.UserFilters & middlewareTypes.JwtPayload = req.body
    const filters: Filters = new Filters(data, res)

    await filters.getFilters()
    
  }catch(err){
    console.log(err); 
    res.status(500).json({msg: err})
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

