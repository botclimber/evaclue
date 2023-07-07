const Db = require("./Db.js")
const RevChecker = require("./model/RevChecker.js")
const date = require('date-and-time')

/**
 * 
 * @param {*} model
 * @param {userId, addressId} userReviewObject 
 */
module.exports = class Validator{

    /**
     * 
     * @param {Object} userParam {userId, addressId}
     */
    static async multipleReviews(model, userParam){

        console.log("Verifying if review for this address already exists...")
        
        const tableName = "RevChecker"
        const params = {field: "userId", value: userParam.userId}
        const getRevCheckerData = await model.selectAllByParam(tableName, params)

        console.log("what it got from DB ?")
        console.log(getRevCheckerData)

        const getAddressReview = (getRevCheckerData !== undefined)? getRevCheckerData.filter(r => r.addressId == userParam.addressId) : []
        console.log("getAddressReview: ")
        console.log(getAddressReview)

        if(!(getAddressReview.length > 0)){
            console.log("This user doesnt have any review for this address yet")
            // create record
            await this.createRevCheckerRecord(model, userParam)

            return false
        }
        else {
            const lastDate = new Date(getAddressReview[0].lastReviewDate)
            const lastDatePlus6 = date.addMonths(lastDate, 6)
        
            const currentDate = new Date()
            
            if(currentDate > lastDatePlus6){
                const chgConfig = {tableName: "RevChecker", id: getAddressReview[0].id, columns: ["lastReviewDate", "totReviews"], values: [date.format(new Date(currentDate), "YYYY/MM/DD HH:mm:ss"), getAddressReview[0].totReviews + 1]}
                await model.update(chgConfig)

                return false
            
            }else
                return true
        }

    }

    /**
     * This can be reused if we want e.g. to not able users to make more than one first review for an address
     * 
     * @param {*} model 
     * @param {*} userParam 
     */
    static async createRevCheckerRecord(model, userParam){

        // create record
        const revChecker = new RevChecker(userParam.userId, userParam.addressId)
        console.log("Creating record on RevChecker table ...")
        await model.insert(revChecker)
        console.log("Record Created.")
    }
}