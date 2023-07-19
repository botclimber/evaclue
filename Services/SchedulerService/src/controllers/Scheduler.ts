import axios from "axios"

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
    private mountData = async (): Promise<availableForRentByUserFilter>  => {
        
       return {toEmail: "", available: []}
    }

    async sendAvailableResidencesByFilter(): Promise<void>  {
        const data: availableForRentByUserFilter = await this.mountData()

        console.log("Data preparation finished:")
        console.log(data)

        console.log("\n sending request to Notification Service ...")
        await axios
            .post(`http://localhost:${process.env.not_PORT}/notifications/v1/notifyUsers`, {data: data}, { headers: {"Content-Type": "application/json"}} )
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
}