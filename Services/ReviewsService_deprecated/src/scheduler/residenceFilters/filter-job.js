const schedule = require("node-schedule")
const axios = require("axios")
const act = require("../../actions.js")

/**
 * we must pay attention if the user is filtering by only one filter or multiple ones
 * 
 * @return {Object} {toBeInformed: [{toEmail: string, cities: string[], lat: number[], lng: number[]}]}
 */
sendNotOnFilter = async () => {
    
    const addresses = await act.actions().getAddresses()
    const resOwners = await act.actions().getResOwners()
    const usersFilters = await act.actions().getUserFilters()

    console.log("filtering on free and approved residences ...")
    const filteredByFreeResOwners = resOwners.filter(r => r.free && r.approved)

    const mapResToAddress = (res) => {
       const city = addresses.find(r => r.id == res.addressId)
       return {...res, ...{city: city}}
    }

    console.log("match residence owner with address ...")
    const resOwnerPlusCity = filteredByFreeResOwners.map(mapResToAddress)

    console.log("Prepare data to be sent within the request ...")
    console.log(usersFilters)
    const usersToBeNotified = usersFilters.filter( r => r.enable).map( r => {
        const cities = r.byCities.toUpperCase()
        const rent = [r.byRentPriceMin, r.byRentPriceMax]

        const byCity = (cities.length > 0)? resOwnerPlusCity.filter(resData => cities.includes(resData.city.city.toUpperCase())) : resOwnerPlusCity
        
        const regardinglessCity = (resData) => (rent[1] > 0)? resData.rentPrice > rent[0] && resData.rentPrice < rent[1] : true
        const byRent = byCity.filter(regardinglessCity)

        /*
        [{userId, city, flat (optional), floor (optional), lat, lng}]
        */

        return { toEmail: r.userEmail, available: byRent.map(data => {
            return {resOwnerId: data.userId, city: data.city.city, street: data.city.street, nr: data.city.nr, flat: data.flatOwner, floor: data.floorOwner, rentPrice: data.rentPrice, lat: data.cityLat, lng: data.cityLng} 
           }) }
    })

    console.log("Data preparation finished:")
    console.log(usersToBeNotified)

    console.log("\n sending request to Notification Service ...")
    await axios
        .post(`http://localhost:${process.env.not_PORT}/notifications/v1/notifyUsers`, {data: usersToBeNotified}, { headers: {"Content-Type": "application/json"}} )
        .then(response => console.log(response))
        .catch(err => console.log(err))
}

const rule = new schedule.RecurrenceRule();

/**
 * runs on monday, wednesday and saturday
 */
rule.dayOfWeek = [1,3,6];
rule.hour = 20;
rule.minute = 0;

/* For test purposes

rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 18;
rule.minute = 45;
*/

schedule.scheduleJob(rule, async function(){ await sendNotOnFilter() });