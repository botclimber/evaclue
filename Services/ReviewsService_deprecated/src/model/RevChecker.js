const date = require('date-and-time')
const currentDate = date.format(new Date(), "YYYY/MM/DD HH:mm:ss")

module.exports = class RevChecker {
    constructor(userId, addressId){
      this.userId = userId
      this.addressId = addressId
      this.totReviews = 1
      this.lastReviewDate = currentDate
      this.createdOn = currentDate
    }
  }