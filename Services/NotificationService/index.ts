import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
import cors from 'cors'
import {Subs} from './src/travisScott/travis_actions/travis_tasks/travis_sub/Sub'

import './src/travisScott/travis_types/typeModels' // interface types
import { tokenHandler } from './src/travisScott/travis_check/tokenHandler/tokenHandler';

dotenv.config();

const app: Express = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

const port = process.env.PORT;

const v: string = "v1"
const service: string = "notification"

app.get('/', (req: Request, res: Response) => {
  res.send('Notification Service | API page on development ...');
});

/**
 * Create new subscription
 */
app.post("/"+service+"/"+v+"/sub", async (req: Request, res: Response) => {
  
  // 1. input checking [done]
  // 2. insert in DB [done]
  // 3. send notification email
  try{
    const email: string = req.body.email

    if(email){
      const sub: Subs = new Subs(email)
      await sub.createSub(res)
    
    }else {
      res.status(400).json({msg: "Missing email parameter!"})
    }
    
  }catch (e){
    //res.status(500).json({"error": e})
    console.log(e)
    res.status(500).json("Some Internal Error")
  }

});

/**
 * Send email to residence owner from user
 * owner email should preferencial be hidden from common user (send it to front end encrypted)
 * 
 * 
 */ 
app.post("/"+service+"/"+v+"/emToOwner", (req: Request, res: Response) => {

  tokenHandler(req)
  .then(_ => {
      
      // 1. check token [done]
      // 2. check body parameters
      
      // 3. get email from encrypted
      // 4. send email to res owner
      // 5. create record on contactResOwner table
      // 6. send feedback to user on web page

  })
  .catch(err => { 
    console.log(err); 
    res.status(err.statusCode).send(JSON.stringify({msg: err.msg})) 
  })
});

// TODO: create massive email sending request

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

