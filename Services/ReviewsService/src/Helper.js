const Db = require("./Db.js")
const date = require('date-and-time')
const Location = require('./model/Location.js')
const addrInfo = require('./model/Address.js')
const NBOFilters = require('./model/NBOFilters.js')
const Reviews = require('./model/Review.js')
const ResidenceOwners = require("./model/ResidenceOwner.js")
const conv = require("./convertLocation.js")
const fh = require("./fileHandler.js")

module.exports = class Helper extends Db{
	constructor(ws){
		super()
		this.ws = ws
	}

	// get ResidenceAddress for specific Address
	/**
	 *
	 * @param {*} addressId
	 * @param {*} residenceData
	 * @returns
	 */
	getResForA(addressId, residenceData){
		console.log("Getting all RESIDENCES for addressId: "+addressId)
		return residenceData.filter(row => row.addressId == addressId)
	}

	// get Reviews for specific residenceAddress
	/**
	 *
	 * @param {*} addressId
	 * @param {*} residences
	 * @param {*} unmappedReviews
	 * @returns
	 */
	getRevForRA(addressId, residences, unmappedReviews){
		console.log("Getting all REVIEWS for addressId: "+addressId)
		const reviewsFilterData = residences.flatMap(row => unmappedReviews.filter( revRow => revRow.residenceId == row.id))

		return reviewsFilterData

    }

	// returns a promise with all reviews, addresses and residenceAddresses
	/**
	 *
	 * @returns
	 */
	getAllFromDb(){
		console.log("Getting needed data from DB and Resolving promise ...")
		const allDataPromise = Promise.all([this.selectAll('Reviews'), this.selectAll('ResidenceAddresses'), this.selectAll('Addresses')])

		return allDataPromise
	}

	// create Location data types data which is transformed and orginzed data
	/**
	 *
	 * @param {*} addresses
	 * @param {*} residenceAddresses
	 * @param {*} reviews
	 * @returns
	 */
	generateLocations(addresses, residenceAddresses, reviews){
		console.log("Assembling location data ...")
		return addresses.map(row => {
			const residences = this.getResForA(row.id, residenceAddresses)
			return new Location(row.lat, row.lng, residences, this.getRevForRA(row.id, residences, reviews))
		})
	}

	/**
	 * Some common response format
	 *
	 * @param {object} data
	 * @param {number} lat
	 * @param {number} lng
	 */
	defaultResp(data, lat, lng){
		this.getAllFromDb()
		.then(allDataRes /* 3 arrays of dictionary */=> {
			
			const isApproved = parseInt(data.onlyAppr)
			const rev = (isApproved)? allDataRes[0].filter(row => row.approved === 1) : allDataRes[0]

			// logic goes here
			const assembleData = this.generateLocations(allDataRes[2], allDataRes[1], rev).map(location =>{ location.transform(); return location})
			console.log(assembleData)
			console.log("Mounting response ...")
			const response = {
				type: data.type,
				address: {lat: parseFloat(lat), lng: parseFloat(lng)},
				locations: assembleData
			}

			console.log("Sending response to client ...")
			this.returnResponse(response)

		})
		.catch(err => console.log(err))
	}

	#setupResReview(addrId, data ,lat, lng){
		const residenceAddresses = new addrInfo.ResidenceAddresses(addrId, data.nrFloor, data.nrSide)
		const residenceId = this.insert(residenceAddresses)

		residenceId
		.then(resId => {

			const appr = (data.flag != "fromMapClick")? 1: 0;
			const review = new Reviews(data.userId, data.userName, data.userImage, resId, data.nrReview, data.nrRating, data.nrAnon, appr)
			this.insert(review)
			.then( _ => this.defaultResp(data, lat, lng) )
			.catch(err => console.log(err))

		})
		.catch(err => console.log(err))
	}

	/**
	 *
	 * @param {*} lat
	 * @param {*} lng
	 * @param {*} data
	 */
	createReview(lat, lng, data){

		//Reviews.addReview(review)
		this.exists({tableName: "Addresses", columns: ["lat", "lng"], values: [lat, lng], operator: "and"})
		.then(res => {

			if(res.length) { // for this case if existing, expects only one record
				console.log("Address with id: "+res[0].id+" already registed ...")
				this.#setupResReview(res[0].id,data, res[0].lat, res[0].lng)

			}else{
				console.log("None existing address, registering it ...")
				const newAddress = new addrInfo.Addresses(lat, lng, data.city, data.street, data.buildingNumber, data.postalCode, data.country)
				this.insert(newAddress)
				.then(addressId => this.#setupResReview(addressId, data, lat, lng))
				.catch(err => console.log(err))

			}
		})
		.catch(err => console.log(err))

	}

	/**
	 *
	 * @param {*} response
	 */
	returnResponse(response){ this.ws.status(200).send(JSON.stringify(response)); }

	changeReviewApprovalState(adminId, revId, state){
		const chgConfig = {tableName: 'Reviews', id: revId, columns: ['adminId', 'approved','approvedOn'], values: [adminId, state, date.format(new Date(), "YYYY/MM/DD HH:mm:ss")]}
		this.update(chgConfig)
		.then(res => console.log(res+" row changed!"))
		.catch(err =>{
			 console.log(err)
			this.ws.status(500).send(JSON.stringify({msg: 'something went wrong'}));
		})

	}

	/**
	 * 
	 * @param {object} input 
	 * @param {object} files 
	 */
	async createResOwnerRecord(input, files){
		const fileName = "userProofOfRes-"+input.userId+".pdf"

		const cResidenceOwner = (addrId, city) => {
			// get city lat, lng
			console.log("Getting city lat,lng ...")
			conv.getLatLng({city: city})
			.then(res => {
				
				// create residenceOwner
				console.log("Creating residenceOwner row ...")
				console.log(input.userId, input.userName, input.userImage, addrId, res[0].latitude, res[0].longitude, input.floor, input.flat, input.free, fileName)
				
				const newResidenceOwner = new ResidenceOwners(input.userId, input.userName, input.userImage, addrId, res[0].latitude, res[0].longitude, input.floor, input.flat, input.free, fileName)
				console.log("Inserting residenceOwner row in the DataBase ...")
				this.insert(newResidenceOwner)

				console.log("Record created!")
				this.returnResponse({msg: "Record created!"})
									
			})
			.catch(err => console.log(err))
		}

		console.log("Checking if its a claim of an already registed address ...")
		this.exists({tableName: "Addresses", columns: ["lat", "lng"], values: [input.resLat, input.resLng], operator: "and"})
		.then(res => {

			console.log("Handling File ...")
			fh.fileHandler(files, fileName, process.env.DIRNAME)

			if(res.length) { // for this case if existing, expects only one record
				console.log("Address with id: "+res[0].id+" already registed ...")

				console.log("calling residence owner handler ...")
				return cResidenceOwner(res[0].id, res[0].city, fileName)

			}else{
				// create address and residenceOwner record
				console.log("None existing address, registering it ...")
				const newAddress = new addrInfo.Addresses(input.resLat, input.resLng, input.city, input.street, input.buildingNumber, input.postalCode, input.country)
				
				this.insert(newAddress)
				.then(addressId =>{ 
				
				console.log("calling residence owner handler ...")
				return cResidenceOwner(addressId, input.city, fileName)

				})
				.catch(err => console.log(err))

			}
		})
		.catch(err => console.log(err))
	}

	
	resPerCity(city){
		console.log("getting all residence owners from db ...")
		this.selectAll("ResidenceOwners")
		.then(res => {	
			console.log("Getting lat,lng for mentioned city: "+city)
			conv.getLatLng({city: city})
			.then(resFromGeoCoder => {
				console.log("Mounting response for following location: ("+resFromGeoCoder[0].latitude+", "+resFromGeoCoder[0].longitude+") ...")
				const filResidences = res.filter(row => ( row.approved === 1 && row.cityLat === resFromGeoCoder[0].latitude && row.cityLng === resFromGeoCoder[0].longitude))
				
				if(filResidences.length > 0){
					//TODO: get all address mount response based on all residenceOnwers+addresses (by ID)
					this.selectAll("Addresses")
					.then(addrs => {
						const addressesToMap = new Map()
						addrs.map(r => addressesToMap.set(r.id, r))

						console.log("Mapped addresses"+addressesToMap)

						const dataToBeSent = filResidences.map(row => { 
							const addr = addressesToMap.get(row.addressId)
							console.log("Address from map"+addr)

							return {resOwnerId: row.id, userName: row.userName, userImg: row.userImg, addressId: row.addressId, lat: addr.lat, lng: addr.lng, city: addr.city, street: addr.street, nr: addr.nr, cityLat: row.cityLat, cityLng: row.cityLng, floor: row.floorOwner, flat: row.flatOwner, rentPrice: row.rentPrice, free: row.free} }
						)

						console.log(dataToBeSent)
						this.returnResponse(dataToBeSent)

					})
					.catch(err => console.log(err))

				}else this.ws.status(200).send(JSON.stringify({msg: "No available residences for rent found!"}))
			})
			.catch(err => { 
				console.log(err)
				this.ws.status(500).send(JSON.stringify({msg: "Something went wrong when trying to get data from google maps api!"}))
			})

		})
		.catch(err => {
			console.log(err)
			this.ws.status(500).send(JSON.stringify({msg: "Something went wrong when selecting data from db!"}))
		})
	}

	/**
	 * 
	 * @param {object} input 
	 */
	updateROApprovalState(adminId, claimId, state){

		const chgConfig = {tableName: 'ResidenceOwners', id: claimId, columns: ['adminId', 'approved','approvedOn'], values: [adminId, state, date.format(new Date(), "YYYY/MM/DD HH:mm:ss")]}
		this.update(chgConfig)
		.then(res => console.log("Row updated! ID: "+claimId))
		.catch(err =>{
			 console.log(err)
			this.ws.status(500).send(JSON.stringify({msg: 'something went wrong'}));
		})
	}

	/**
	 * 
	 */
	getAllROData(){
		this.selectAll("ResidenceOwners")
		.then(res => {
			this.returnResponse({claims: res})
		})
		.catch(err => console.log(err))
	}

	/**
	 * 
	 * @param {Object} input 
	 */
	setFilter(input){

		const exObject = {tableName: "NBOFilters", columns: ["userId"], values: [input.userId], operator: ""}
		this.exists(exObject)
		.then(res => {
			if(res.length){
				const enable = parseInt(input.enable)
				
				if(!enable){
					const upObject = {tableName: "NBOFilters", id: res[0].id, columns: ["enable"], values: [enable]}
					this.update(upObject)
					.then(res => this.ws.status(200).send(JSON.stringify({msg: `Filter Disabled `})))
					.catch(err =>{
						console.log(err)
						this.ws.status(500).send(JSON.stringify({msg: 'something went wrong'}));
					})

				}else{
					//all parameters required
					const upObject = {tableName: "NBOFilters", id: res[0].id, columns: ["byCities", "byRentPriceMin", "byRentPriceMax", "enable"], values: [input.byCities, input.byRentPriceMin, input.byRentPriceMax, 1]}

					this.update(upObject)
					.then(res => this.ws.status(200).send(JSON.stringify({msg: `Filter updated`, values: {cities: input.byCities, rentMin: input.byRentPriceMin, rentMax: input.byRentPriceMax}})))
					.catch(err =>{
						console.log(err)
						this.ws.status(500).send(JSON.stringify({msg: 'something went wrong'}));
					})
				}

			}else{
				// create new
				const newUserFilter = new NBOFilters(input.userName, input.userId, input.userEmail, input.byCities, input.byRentPriceMin, input.byRentPriceMax, 0)
				const userFilterId = this.insert(newUserFilter)

				userFilterId
				.then(id => {
					console.log(`New Filter created with id: ${id}`)
					this.ws.status(200).send(JSON.stringify({msg: "Filter Created", values: {cities: input.byCities, rentMin: input.byRentPriceMin, rentMax: input.byRentPriceMax}}))

				})
				.catch(err => {
					console.log(err)
					this.ws.status(500).send(JSON.stringify({msg: 'something went wrong'}))
				})

			}
		})
		.catch(err => console.log(err))
	}

	getFilter(userId){
		const filterExists = {tableName: "NBOFilters", columns: ["userId"], values: [userId], operator: ""}
		this.exists(filterExists)
		.then(res => {
			if(res.length){
				this.selectOne("NBOFilters", res[0].id)
				.then(data => {
					console.log("SELECTED DATA:")
					console.log(data)
					
					const response = {msg: "filter found", values: {cities: data.byCities, rentMin: data.byRentPriceMin, rentMax: data.byRentPriceMax, enable: data.enable}}

					this.returnResponse(response)
				})

			}else{
				this.ws.status(204).send(JSON.stringify({msg: "no filter set"}))
			}
		})
		.catch(err => console.log(err))
	}
	
	getAddresses(){ return this.selectAll("Addresses")}
	getResOwners(){return this.selectAll("ResidenceOwners")}
	getUserFilters(){return this.selectAll("NBOFilters")}

	//getAllForSingleRO(userId){}

}
