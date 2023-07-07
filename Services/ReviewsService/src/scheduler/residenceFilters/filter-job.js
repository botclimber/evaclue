const schedule = require("node-schedule")
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
    // TODO: make the request to the notification services with the already prepared data, then on the notification services create the message template and massive sent it to users
    

}

sendNotOnFilter()

/*const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1,3,6];
rule.hour = 20;
rule.minute = 0;

schedule.scheduleJob(rule, async function(){ await sendNotOnFilter() });*/