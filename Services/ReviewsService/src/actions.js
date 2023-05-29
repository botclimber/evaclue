const conv = require("./convertLocation.js")
const Helper = require("./Helper.js")
const {isAuthz} = require("./authorization.js")

// ws is an array or list of clients
exports.actions = (function(ws = undefined){
	const helper = new Helper(ws)

	// ACTION TO SEARCH FOR ADDRESS
	function search(data){
		console.info("Starting search action for "+ws+" client containing following data: "+JSON.stringify(data))

		conv.getLatLng(data)
			.then(res => {

					console.info("Assembling default response ...")
					helper.defaultResp(data, res[0].latitude, res[0].longitude)

			}).catch(reason => {

				console.log("Couldnt handle request " + reason)
				ws.status(500).send(JSON.stringify({ msg: 'something went wrong'}));
			});
	}

	// ACTION TO INSERT/CREATE NEW REVIEW
	function insertReview(data){

		if(data.lat !== "" && data.lng !== ""){
			console.info("Use of defined lat, lng ("+data.lat+", "+data.lng+")")
			helper.createReview(data.lat, data.lng, data)

		}else{
			console.info("Lat and Lng not defined ... requesting it by using address ("+data.city+", "+data.street+", "+data.buildingNumber+")")
			conv.getLatLng(data)
			.then(res => {

				helper.createReview(res[0].latitude, res[0].longitude, data); })
			.catch( reason => {

				console.log(reason)
				ws.status(500).send(JSON.stringify({msg: 'something went wrong'}));

			});
		}
	}

	// ACTION TO GET ALL REVIEWS
	function getAllReviews(){
		helper.getAllFromDb()
		.then(res => {
			console.log("assembling all reviews...")
			const allReviews = res[0]
			.map(rev => {
				const residence = res[1].find(res => res.id == rev.residenceId)
				const addr = res[2].find(address => address.id == residence.addressId)

				return {rev: rev, res: residence, addr: addr}
			}) // continue map tree constuction

			const response = {
				type: "allReviews",
				reviews: allReviews
			}

			console.log(response)
			console.log("Sending response to client ...")
			helper.returnResponse(response)

		})
		.catch(err => {

			console.log(err)
			ws.status(500).send(JSON.stringify({msg: 'something went wrong'}));
		})
	}

	// ACTION TO UPDATE A REVIEW STATE (pending, approved, rejected)
	function updateReviewState(data){
		
		if(isAuthz(data.userType)) {
			helper.changeReviewApprovalState(data.adminId, data.revId, data.decision)
			this.getAllReviews()
		}else return ws.status(400).send(JSON.stringify({msg: "no sufficient rights!"}))

	}

	async function checkIfAnyEmpty(input){
		for (const [key, value] of Object.entries(input)) {
			console.log(value)
			if (value === ""){console.log(key, value); throw Error("Please fill all fields!") }
		}

		return false
	}

	/**
	 * 
	 * @param {object} input 
	 * @param {object} files 
	 */
	function createResOwner(input, files){	
		console.log(input)
		
		// 1. check if no empty fields
		checkIfAnyEmpty(input)
		.then(_ => {
			// 2.
			helper.createResOwnerRecord(input, files)
			.catch(err => {

				console.log(err)
				ws.status(500).send(JSON.stringify({msg: 'something went wrong'}));
			})	
		})
		.catch(e => {
			ws.status(400).send(JSON.stringify({error: e, msg: "Some empty value!"}))
		})	  
	}

	function getResidencesForCity(city){

		if(city && city !== ""){
			helper.resPerCity(city)
			
		}else ws.status(200).send(JSON.stringify({msg: "Nothing found!"}))
	}

	function approveResidenceOwner (input){
		if(isAuthz(input.userType)) {
			helper.updateROApprovalState(input.adminId, input.claimId, input.decision)
			helper.getAllROData()
		}else return ws.status(400).send(JSON.stringify({msg: "no sufficient rights!"}))
	}

	function getAllResidenceOwners(userType){
		
		if(isAuthz(userType)) {
			helper.getAllROData()
		}else return ws.status(400).send(JSON.stringify({msg: "no sufficient rights!"}))
	}

	function setFilter(input){
		if( (!input.userName || input.userName == "") || (!input.userId) || (!input.userEmail || input.userEmail == "")){
			helper.setFilter(input)

		}else return ws.status(400).send(JSON.stringify({msg: "Bad request, some required parameters missing!"}))
	}

	function getUserFilters(){ return helper.getUserFilters() }
	function getAddresses(){ return helper.getAddresses() }
	function getResOwners(){ return helper.getResOwners() }

	return { search, 
			insertReview, 
			getAllReviews, 
			updateReviewState, 
			createResOwner, 
			approveResidenceOwner, 
			getAllResidenceOwners, 
			getResidencesForCity,
			// intern functions
			getAddresses,
			getResOwners,
			getUserFilters,
			setFilter
			}

})
