import axios from "axios"
import { errorMessages as err } from "../helpers/errorMessages"

import { Db } from "../db/Db"

import { UserFilters } from "../models/UserFilters"
import { Addresses } from "../models/Addresses"
import { ResidenceOwners } from "../models/ResidenceOwners"
import { Users } from "../models/Users"
import { Residences } from "../models/Residences"

type availableResidences = {
    resOwnerId: number,
    city: string,
    street: string,
    nr: string,
    floor: string,
    direction: string,
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

        const addresses: Addresses[] = await db.selectAll<Addresses>("Addresses")
        const resOwners: ResidenceOwners[] = await db.selectAll<ResidenceOwners>("ResidenceOwners")
        const usersFilters: UserFilters[] = await db.selectAll<UserFilters>("NBOFilters")
        const users: Users[] = await db.selectAll<Users>("Users")
        const residences: Residences[] = await db.selectAll<Residences>("Residences")

        const usersMap = new Map<number, Users>()
        const residencesMap = new Map<number, Residences>()

        users.forEach( user => {
            if(user.id) usersMap.set(user.id, user)
        })

        residences.map(residence => {
            if(residence.id) residencesMap.set(residence.id, residence)
        })

        console.log("filtering on free and approved residences ...")
        const filteredByFreeResOwners: ResidenceOwners[] = resOwners.filter(r => r.free && r.approved)

        type resOwnerPlusAddress = ResidenceOwners & {address: Addresses}
        const mapResToAddress = (res: ResidenceOwners): resOwnerPlusAddress => {
            const city: Addresses | undefined = addresses.find(r => r.id == res.addressId)

            if(city === undefined) throw Error(err.ADDRESS_SEGMENT_FAULT.text);
            
            return {...res, ...{address: city}}
        }

        console.log("match residence owner with address ...")
        const resOwnerPlusCity: resOwnerPlusAddress[] = filteredByFreeResOwners.map(mapResToAddress)

        console.log("Prepare data to be sent within the request ...")
        console.log(usersFilters)
        const usersToBeNotified: availableForRentByUserFilter[] = usersFilters.filter( r => r.enable).map( r => {
            
            const email = usersMap.get(r.userId)?.email
            if(email){ 
            
                const cities = r.byCities.toUpperCase()
                const rent = [r.byRentPriceMin, r.byRentPriceMax]

                const byCity: resOwnerPlusAddress[] = (cities.length > 0)? resOwnerPlusCity.filter(resData => cities.includes(resData.address.city.toUpperCase())) : resOwnerPlusCity
                
                const regardinglessCity = (resData: resOwnerPlusAddress) => (rent[1] > 0)? resData.rentPrice > rent[0] && resData.rentPrice < rent[1] : true
                const byRent = byCity.filter(regardinglessCity)

                return { 
                    toEmail: email, 
                    available: byRent.map(data => {
                        return {resOwnerId: data.userId, city: data.address.city, street: data.address.street, nr: data.address.nr, floor: residencesMap.get(data.resId)?.floor || "???", direction: residencesMap.get(data.resId)?.direction || "???", rentPrice: data.rentPrice, lat: data.address.lat, lng: data.address.lng} 
                    }) 
                }
            
            }else throw Error(err.EMAIL_SEGMENT_FAULT.text)
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