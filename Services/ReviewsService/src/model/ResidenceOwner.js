const date = require('date-and-time')

module.exports = class ResidenceOwners {
  constructor(userId, userName, userImg, addressId, cityLat, cityLng, floorOwner, flatOwner, free, fileProof, hide = 0){

	this.userId = userId
	this.userName = userName,
	this.userImg = userImg,
	this.adminId = 0
	this.addressId = addressId
	this.cityLat = cityLat
	this.cityLng = cityLng
	this.floorOwner = floorOwner
	this.flatOwner = flatOwner
	this.rentPrice = 0.0
	this.free = free
	this.createdOn = date.format(new Date(), "YYYY/MM/DD HH:mm:ss")
	this.approvedOn = "1000-01-01"
	this.approved = 0
	this.hide = hide
	this.fileProof = fileProof
	}
}
