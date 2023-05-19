import {Db} from "../../../../Db/Db"
import {Sub} from "../../../travis_types/typeModels"
import date from "date-and-time"

export class Subs{
    className: string = "Subs"

    async createSub(email: string, res: Record<string, any>): Promise<Response | void>{
        const db: Db = new Db()

        // order matters
        const sub: Sub = {
            email: email,
            createdAt: date.format(new Date(), "YYYY/MM/DD HH:mm:ss")
        }
        
        try{

            // check if email already exists
            const getOne: Sub[] = await db.selectOne<Sub>(sub, this.className)

            if(getOne.length) 
                res.status(400).json({msg:"Email already existing!"})
            else {
                const result: number = await db.insert(sub, this.className)
                console.log(result , typeof(result))
                if(result)
                   res.status(200).json({"msg":"row created, thanks!"})

            }

        }catch (e){
            console.log(e)
            throw (e)
        }     
    }
}