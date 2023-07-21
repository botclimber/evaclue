import axios from "axios"
import { errorMessages as err } from "../helpers/errorMessages"

import { Db } from "../db/Db"

import { UserFilter } from "../models/UserFilter"
import { Address } from "../models/Address"
import { ResidenceOwner } from "../models/ResidenceOwner"

type availableResidences = {
    resOwnerId: number,
    city: string,
    street: string,
    nr: string,
    flat: string,
    floor: string,
    rentPrice: number,
    lat: number,
    lng: number
}

interface availableForRentByUserFilter {
    toEmail: string,
    available: availableResidences[]
}

export class Scheduler{
    
    // TODO: complete method
    private mountData = async (): Promise<availableForRentByUserFilter[]>  => {
        const db: Db = new Db()

        const addresses: Address[] = await db.selectAll<Address>("Addresses")
        const resOwners: ResidenceOwner[] = await db.selectAll<ResidenceOwner>("ResidenceOwners")
        const usersFilters: UserFilter[] = await db.selectAll<UserFilter>("NBOFilters")

        console.log("filtering on free and approved residences ...")
        const filteredByFreeResOwners: ResidenceOwner[] = resOwners.filter(r => r.free && r.approved)

        type resOwnerPlusAddress = ResidenceOwner & {address: Address}
        const mapResToAddress = (res: ResidenceOwner): resOwnerPlusAddress => {
            const city: Address | undefined = addresses.find(r => r.id == res.addressId)

            if(city === undefined) throw Error(err.ADDRESS_SEGMENT_FAULT.text);
            
            return {...res, ...{address: city}}
        }

        console.log("match residence owner with address ...")
        const resOwnerPlusCity: resOwnerPlusAddress[] = filteredByFreeResOwners.map(mapResToAddress)

        console.log("Prepare data to be sent within the request ...")
        console.log(usersFilters)
        const usersToBeNotified: availableForRentByUserFilter[] = usersFilters.filter( r => r.enable).map( r => {
            
            const cities = r.byCities.toUpperCase()
            const rent = [r.byRentPriceMin, r.byRentPriceMax]

            const byCity: resOwnerPlusAddress[] = (cities.length > 0)? resOwnerPlusCity.filter(resData => cities.includes(resData.address.city.toUpperCase())) : resOwnerPlusCity
            
            const regardinglessCity = (resData: resOwnerPlusAddress) => (rent[1] > 0)? resData.rentPrice > rent[0] && resData.rentPrice < rent[1] : true
            const byRent = byCity.filter(regardinglessCity)

            return { 
                toEmail: r.userEmail, 
                available: byRent.map(data => {
                    return {resOwnerId: data.userId, city: data.address.city, street: data.address.street, nr: data.address.nr, flat: data.flatOwner, floor: data.floorOwner, rentPrice: data.rentPrice, lat: data.cityLat, lng: data.cityLng} 
                }) 
            }
        })

        return usersToBeNotified
        
    }

    async sendAvailableResidencesByFilter(): Promise<void>  {
        const data: availableForRentByUserFilter[] = await this.mountData()

        console.log("Data preparation finished:")
        console.log(data)

        console.log("\n sending request to Notification Service ...")
        await axios
            .post(`http://localhost:${process.env.not_PORT}/notifications/v1/notifyUsers`, {data: data}, { headers: {"Content-Type": "application/json"}} )
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
}