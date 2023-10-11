import {Response} from "express"
import {Db} from "../../../../Db/Db"
import {ToContact} from "../../../types/typeModels"
import * as types from "../../../types/typeModels"
import {Users} from "../../../../../../CommonUtils/src/models/Users"
import {ContactResOwner} from "../../../../../../CommonUtils/src/models/ContactResOwner"
import { genNewDate } from "../../../../../../CommonUtils/src/helpers/DateFormat"

export class classContactResOwnerCompanion{

    static async getUserData(userId: number): Promise<types.userData>{
        
        const db: Db = new Db()

        try{
            const user: Users[] = await db.selectAll<Users>("Users", `id = ${userId}`)

            // if(user.length > 0) never supposed to happen
            
            return {fullName: `${user[0].firstName} ${user[0].lastName}`, email: user[0].email}

        }catch (e){ throw e }
    }

    static async checkComunication(fromUserId: number, toUserId: number): Promise<boolean>{
        const db: Db = new Db();

        try{
            const getRecord: ContactResOwner[] = await db.selectAll("ContactResOwner", `userId = ${fromUserId} and resOwnerId = ${toUserId}`)

            return (getRecord.length > 0)

        }catch(e) { throw e}
    }
}

export class ContactResOwnerClass{
    className: string = "ContactResOwner"
    private resOwner: ToContact

    constructor(resOwner: ToContact){
        this.resOwner = resOwner
    }

    async createContact(res: Response): Promise<Response | void>{
        const db: Db = new Db()

        try{
            // for now is not of interest to store the message on DB
            delete this.resOwner.message
            const toBeInserted: ContactResOwner = new ContactResOwner(this.resOwner.resOwnerId, this.resOwner.userId, genNewDate())

            const result: number = await db.insert(toBeInserted, this.className)
            console.log(result , typeof(result))
            if(result)
                res.status(200).json({msg: "Your message was sent!"})

        }catch (e){
            console.log(e)
            throw (e)
        }   
    }

}