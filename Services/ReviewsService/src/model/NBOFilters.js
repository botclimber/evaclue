module.exports = class NBOFilters {
    constructor(userName, userId, userEmail, byCities, byRentPriceMin, byRentPriceMax, enable){
      this.userName = userName
      this.userId = userId
      this.userEmail = userEmail
      this.byCities = byCities,
      this.byRentPriceMin = parseFloat(byRentPriceMin) //it can maybe file because , or . characters | we must control it
      this.byRentPriceMax = parseFloat(byRentPriceMax) //it can maybe file because , or . characters
      this.enable = enable
    }
  }