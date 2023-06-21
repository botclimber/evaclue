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

    console.log("filtering on free residences ...")
    const filteredByFreeResOwners = resOwners.filter(r => r.free == 1)

    const mapResToAddress = (res) => {
       const city = addresses.find(r => r.id == res.addressId)
       return {...res, ...{city: city}}
    }

    console.log("match residence owner with address ...")
    const resOwnerPlusCity = filteredByFreeResOwners.map(mapResToAddress)

    console.log("Prepare data to be sent within the request ...")
    const usersToBeNotified = usersFilters.filter( r => r.enable == 1).map( r => {
        const cities = r.byCities.split(",")
        const rent = [r.byRentPriceMin, r.byRentPriceMax]

        const byCity = (cities.length > 0)? resOwnerPlusCity.filter(resData => cities.includes(resData.city)) : resOwnerPlusCity

        if(byCity.length > 0){
            const regardinglessCity = (resData) => (rent[1] > 0)? resData.rentPrice > rent[0] && resData.rentPrice < rent[1] : true
        
            const byRent = byCity.filter(regardinglessCity)

            return {toEmail: r.userEmail, cities: byRent.reduce( (left, next) => `${left.city},${next.city}`),lat: byRent.map(data => data.cityLat), lng: byRent.map(data => data.cityLng) }
        
        }
    })

    console.log("Data preparation finished:")
    console.log(`\t\t ${usersToBeNotified}`)

    console.log("\n sending request to Notification Service ...")
    // TODO: make the request to the notification services with the already prepared data, then on the notification services create the message template and massive sent it to users
    

}

sendNotOnFilter()

/*const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1,3,6];
rule.hour = 20;
rule.minute = 0;

schedule.scheduleJob(rule, async function(){ await sendNotOnFilter() });*/