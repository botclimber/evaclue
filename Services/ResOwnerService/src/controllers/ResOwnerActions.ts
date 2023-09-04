import {Db} from "../db/Db"

import { errorMessages as err } from "../helpers/errorMessages"
import { genNewDate } from "../helpers/DateFormat"
import { Addresses } from "../models/Addresses";
import { ResidenceOwners } from "../models/ResidenceOwners";

export class ResOwnerActions {
    db: Db;

    constructor(){
        this.db = new Db();
    }

    async getResOwners(): Promise<ResidenceOwners[]> {

        try{
            const resOwners = await this.db.selectAll<ResidenceOwners>("ResidenceOwners");
            return resOwners

        }catch(e){
            console.log(e)
            throw e
        }

    }

    async getByCity(city: string | undefined): Promise<Partial<ResidenceOwners & Addresses>[]>{
    
        try{
            const addresses: Required<Addresses>[] = await this.db.selectAll<Addresses>("Addresses", `upper(city) = "${city}"`)
            const addressesMap = new Map<number, Addresses>()
            addresses.forEach(r => addressesMap.set(r.id, r))

            const resOwners: ResidenceOwners[] = await this.db.selectAll<ResidenceOwners>("ResidenceOwners")
            const filteredResOwners: ResidenceOwners[] = resOwners.filter(r => r.free && r.approved === 1 && Array.from(addressesMap.keys()).includes(r.addressId))

            if(filteredResOwners.length){
                const dataToBeSent: Partial<ResidenceOwners & Addresses>[] = filteredResOwners.map(row => {
                    const addr: Addresses | undefined = addressesMap.get(row.addressId)

                    return {...row, ...addr}
                })

                // TODO: Filter data that is being sent and shown on client side
                return dataToBeSent

            }else throw Error(err.NO_AVAILABILITY.text)

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async create(data: ResidenceOwners): Promise<number> {
        
        try{
            const resOwnerId = this.db.insert<ResidenceOwners>(data)
            return resOwnerId
        }catch(e){
            console.log(e)
            throw e
        }
    }  

    async exists(userId: number): Promise<boolean> {

        const exists: ResidenceOwners[] | [] = await this.db.selectAll<ResidenceOwners>("ResidenceOwners", `userId = ${userId}`)
        if(exists.length){
            return true

        }else return false
    }

    async update(claimId: number, body: globalTypes.updateResOwnerState): Promise<void> {

        try{
            const chgConfig: DbParams.updateParams = {table: "ResidenceOwners", id: claimId, columns: ["adminId", "approved", "approvedOn"], values: [body.userId, body.state || 0, genNewDate()]} 

            await this.db.update(chgConfig)

        }catch(e){
            console.log(e)
            throw e
        }
    }

}