import { Db } from "../db/Db";
import { Reviews } from "../models/Reviews";
import { genNewDate } from "../helpers/DateFormat";
import { Users } from "../models/Users";

export class ReviewActions {
    
    db: Db;
    constructor(){ this.db = new Db() }

    async getReviews (): Promise<(Reviews & Partial<{userName: string, userImg: string}>)[]> {

        try{
            const users: Users[] = await this.db.selectAll("Users");
            const usersMap = new Map<number, {userName: string, userImg: string}>()

            users.forEach( r => {
                if(r.id)
                    usersMap.set(r.id, {userName: `${r.firstName} ${r.lastName}`, userImg: r.image})
            })

            const reviews: Reviews[] = await this.db.selectAll<Reviews>("Reviews")

            console.log("All reviews:")
            console.log(reviews)

            const filteredReviews = reviews.map(row => { 
                const user = usersMap.get(row.userId)
                if(row.anonymous && user){
  
                    user.userName = "Anonymous"
                    user.userImg = "default.gif"

                }

                return {...row, ...user}
            })

            console.log("filteredReviews: ")
            console.log(filteredReviews)

            return filteredReviews

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async create (review: Reviews): Promise<number> {
        try{
            const result = await this.db.insert<Reviews>(review)
            return result

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async update (revId: number, decision: number, adminId: number): Promise<void> {

        try{
            const chgConfig: DbParams.updateParams = {table: "Reviews", id: revId, columns: ["adminId", "approved", "approvedOn"], values: [adminId, decision || 0, genNewDate()]}
            await this.db.update(chgConfig)

        }catch(e){
            console.log(e)
            throw e
        }
    }
 }