import {Response} from "express"
import {Db} from "../../../../Db/Db"
import {ContactResOwner, User} from "../../../travis_types/typeModels"
import date from "date-and-time"

export class ContactResOwnerClass{
    className: string = "ContactResOwner"
    fromUser: User
    resOwner: ContactResOwner

    constructor(resOwner: ContactResOwner, fromUser: User){
        this.resOwner = resOwner
        this.fromUser = fromUser
    }

    async createContact(res: Response): Promise<Response | void>{

    }

}