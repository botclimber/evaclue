import { Db } from "../db/Db";
import dateAndTime from "date-and-time"
import { RevChecker } from "../models/RevChecker";
import { Address } from "../models/Address";
import { genNewDate } from "../helpers/DateFormat";

export class ReviewValidator {
    db: Db;

    constructor(db: Db){
        this.db = db;
    }

    async reviewLimit(userId: number, addressId: number): Promise<boolean>{
        const table = "RevChecker"
        const query = `userId = ${userId}`

        console.log("Verifying if review for this address already exists...")
        const getRevCheckerData: Required<RevChecker>[] = await this.db.selectAll<RevChecker>(table, query)

        console.log("Data get from Db:")
        console.log(getRevCheckerData)

        const getAddressReview = (getRevCheckerData !== undefined) ? getRevCheckerData.filter(r => r.addressId == addressId) : []
        console.log("getAddressReview: ")
        console.log(getAddressReview)

        if(!(getAddressReview.length > 0)){
            console.log("This user doesnt have any review for this address yet")
            // create record
            await this.createRevCheckerRecord(userId, addressId)
            return false
        
        }else{
            const lastDate = new Date(getAddressReview[0].lastReviewDate)
            const lastDatePlus6 = dateAndTime.addMonths(lastDate, 6)

            const currentDate = new Date()

            if(currentDate > lastDatePlus6){
                const chgConfig: DbParams.updateParams = {table: "RevChecker", id: getAddressReview[0].id, columns: ["lastReviewDate", "totReviews"], values: [dateAndTime.format(new Date(currentDate), "YYYY-MM-DD HH:mm:ss"), getAddressReview[0].totReviews + 1]}

                await this.db.update(chgConfig)

                return false
            
            }else return true

        }
    }

    async createRevCheckerRecord(userId: number, addressId: number): Promise<void>{
        
        const revChecker = new RevChecker(userId, addressId, 1, genNewDate(), genNewDate())
        console.log("Creating record on RevChecker table ...")
        await this.db.insert(revChecker)
        console.log("Record Created")
    }
}