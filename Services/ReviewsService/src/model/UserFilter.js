module.exports = class UserFilter {
    constructor(userName, userId, userEmail, byCities, byRentPriceMin, byRentPriceMax, hide){
      this.userName = userName
      this.userId = userId
      this.userEmail = userEmail
      this.byCities = byCities,
      this.byRentPriceMin = byRentPriceMin //it can maybe file because , or . characters | we must control it
      this.byRentPriceMax = byRentPriceMax //it can maybe file because , or . characters
      this.hide = hide
    }
  }