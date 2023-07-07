import {Users, AvailableRents} from "../../../types/typeModels"
import {Db} from "../../../../Db/Db"

export class NotifyUsers {
    className: string = "NotifyUsers"
    private usersToBeNotified: AvailableRents[]

    constructor(data: AvailableRents[]){
        this.usersToBeNotified = data
    }
    
    async sendEmailToUsers(){
        const db: Db = new Db()

        const usersMap = new Map<number, string>();
        
        (await db.selectAll<Users>("Users")).forEach(element => {
            usersMap.set(element.id, element.email)
        });

        this.usersToBeNotified.forEach(element => {
            // get resOwner email
        });

    }

}