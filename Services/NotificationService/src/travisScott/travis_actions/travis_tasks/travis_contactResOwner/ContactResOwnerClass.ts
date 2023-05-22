import {Response} from "express"
import {Db} from "../../../../Db/Db"
import {ContactResOwner} from "../../../travis_types/typeModels"

export class ContactResOwnerClass{
    className: string = "ContactResOwner"
    private resOwner: ContactResOwner

    constructor(resOwner: ContactResOwner){
        this.resOwner = resOwner
    }

    async createContact(res: Response): Promise<Response | void>{
        const db: Db = new Db()

        try{
            // for now is not of interest to store the message on DB
            delete this.resOwner.message
            const result: number = await db.insert(this.resOwner, this.className)
            console.log(result , typeof(result))
            if(result)
                res.status(200).json({msg: "Your message was sent!"})

        }catch (e){
            console.log(e)
            throw (e)
        }   
    }

}