import {Response} from "express"
import {Db} from "../../../../Db/Db"
import {EmailForm, Sub} from "../../../travis_types/typeModels"
import date from "date-and-time"
import fs from "fs"
import { EmailTemplate } from "../../travis_sendEmail/EmailTemplate"
import { EmailEngine } from "../../travis_sendEmail/EmailEngine"

export class Subs{
    className: string = "Subs"
    private sub: Sub

    constructor(email: string){

        // order matters
        this.sub = {
            email: email,
            createdAt: date.format(new Date(), "YYYY/MM/DD HH:mm:ss")
        }
    }

    /**
     * Saves information in Database
     * 
     * @param res 
     */
    async createSub(res: Response): Promise<Response | void>{
        const db: Db = new Db()

        try{

            // check if email already exists
            const getOne: Sub[] = await db.selectOne<Sub>(this.sub, this.className)

            if(getOne.length){
                console.log(`Email ${this.sub.email} exists!`)
                res.status(400).json({"msg":"Email already existing!"})
            }else {
                const result: number = await db.insert(this.sub, this.className)
                console.log(result , typeof(result))
                if(result){
                   
                    const subject: string = "Thanks for subscribing!"
                    const html: string = EmailTemplate.forSubscription()
                    const emailForm: EmailForm = {to: this.sub.email, subject: subject, html: html}
                    const instanceOfEmail = new EmailEngine(emailForm)
                    
                    await instanceOfEmail.send()

                    res.status(200).json({"msg":"Email subscribed, thanks!"})
                }
            }

        }catch (e){
            console.log(e)
            throw (e)
        }     
    }

    /**
     * Saves information in .csv file | only for the cases where DB not available
     * For test and alternative purposes only
     * 
     * @param res 
     */
    async createSubToCSV(res: Response): Promise<Response | void>{
        
        try{    

            // check if email already exists
            fs.readFile("emails.csv", "utf-8", (err, data: string) => {
                console.log(this.sub.email)
                if(err) console.log(err)
                else{
                    
                    const checkEmail: boolean = data.includes(this.sub.email)
                    if(!checkEmail){
                        //fs.writeFile("emails.csv", data+`${this.sub.email},${this.sub.createdAt}\n`, async (err) => {
                        fs.writeFile("emails.csv", data+`teste@teste.pt,${this.sub.createdAt}\n`, async (err) => {
                            if(err) { console.log(err); throw "somehthing went wrong!"}
                            else{
                                fs.close

                                const subject: string = "Thanks for subscribing!"
                                const html: string = EmailTemplate.forSubscription()
                                const emailForm: EmailForm = {to: this.sub.email, subject: subject, html: html}
                                const instanceOfEmail = new EmailEngine(emailForm)

                                await instanceOfEmail.send()
                                
                                res.status(200).json({"msg":"Email subscribed, thanks!"})
                            }
                        })
                    }else
                        // email already registed
                        res.status(400).json({"msg":"Email already existing!"})
                    
                }
            })

        }catch (e){
            console.log(e)
            throw (e)
        }     
    }
}
