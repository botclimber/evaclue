import {Db} from "../../../CommonUtils/src/db/Db";
import "../../../CommonUtils/src/types/globals"

import { errorMessages as err } from "../../../CommonUtils/src/helpers/errorMessages";
import { genNewDate } from "../../../CommonUtils/src/helpers/DateFormat";
import { Addresses } from "../../../CommonUtils/src/models/Addresses";
import { ResidenceOwners } from "../../../CommonUtils/src/models/ResidenceOwners";
import { Residences } from "../../../CommonUtils/src/models/Residences";
import { Users } from "../../../CommonUtils/src/models/Users";

export class ResOwnerActionsCompanion {

    static async getAddresses(db: Db, city?: string): Promise<Map<number, Addresses>> {
        try{
            const cond = (city)? `upper(city) = "${city}"` : "";
            const addresses = await db.selectAll<Addresses>("Addresses", cond);
            const addressesMap = new Map<number, Addresses>()
            addresses.forEach(r => addressesMap.set(r.id, r))

            return addressesMap

        }catch(e){ throw e}
    }

    static async getResidences(db: Db): Promise<Map<number, Residences>> {
        try{
            const residences: Required<Residences>[] = await db.selectAll<Residences>("Residences")
            const residencesMap = new Map<number, Residences>()
            residences.forEach(r => residencesMap.set(r.id, r))

            return residencesMap

        }catch(e){ throw e}

    }

    static async getUsers(db: Db): Promise<Map<number, Users>> {
        try{
            const users = await db.selectAll<Users>("Users")
            const usersMap = new Map<number, Users>()
            users.forEach(r => usersMap.set(r.id, r))

            return usersMap
        }catch(e){ throw e}
    }
}

export class ResOwnerActions {
    db: Db;

    constructor(){
        this.db = new Db();
    }

    async getOwnedResidences(userId: number): Promise<ResidenceOwners[]> {

        try{
            const resOwners = await this.db.selectAll<ResidenceOwners>("ResidenceOwners", `userId = ${userId}`);
            return resOwners

        }catch(e){
            console.log(e)
            throw e
        }

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
            const usersMap = await ResOwnerActionsCompanion.getUsers(this.db) 
            const residencesMap = await ResOwnerActionsCompanion.getResidences(this.db)
            const addressesMap = await ResOwnerActionsCompanion.getAddresses(this.db, city)

            const resOwners: ResidenceOwners[] = await this.db.selectAll<ResidenceOwners>("ResidenceOwners")
            const filteredResOwners: ResidenceOwners[] = resOwners.filter(r => r.free && r.approved === 1 && Array.from(addressesMap.keys()).includes(r.addressId))

            if(filteredResOwners.length){
                const dataToBeSent = filteredResOwners.map(row => {
                    const addr: Addresses | undefined = addressesMap.get(row.addressId)
                    const residence: Residences | undefined = residencesMap.get(row.resId)
                    const user: Users | undefined = usersMap.get(row.userId)

                    return {resData: {...row, ...{userName: `${user?.firstName} ${user?.lastName}`, userImage: user?.image}}, addr: addr, res: residence}
                
                }) as Partial<ResidenceOwners & Addresses & Residences>[]

                // TODO: Filter data that is being sent and shown on client side
                return dataToBeSent

            }else throw new Error(err.NO_AVAILABILITY.text)

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

    async exists(userId: number, addrId: number, resId: number): Promise<boolean> {

        // TODO: change logic, create new table to count how many claim attemps for each user
        const exists: ResidenceOwners[] | [] = await this.db.selectAll<ResidenceOwners>("ResidenceOwners", `userId = ${userId} and addressId = ${addrId} and resId = ${resId} and approved < 2`)
        if(exists.length){
            return true

        }else return false
    }

    async update(claimId: number, body: globalTypes.updateResOwnerState & middlewareTypes.JwtPayload): Promise<void> {

        try{
            const chgConfig: DbParams.updateParams = {table: "ResidenceOwners", id: claimId, columns: ["adminId", "approved", "approvedOn"], values: [body.userId, body.decision || 0, genNewDate()]} 

            await this.db.update(chgConfig)

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async updateByParams(resId: number, body: DynamicObject<Partial<ResidenceOwners> & middlewareTypes.JwtPayload> ): Promise<void> {

        const validKeys = ["rentPrice", "free", "bedRooms", "bathRooms", "flatSize", "notes", "parking", "elevator", "buildingAge"]
        try{
            const userId = body.userId
            
            const paramKeysToUpdate = []
            const paramValuesToUpdate = []
            for (let key in body){
                if (validKeys.includes(key)){
                    paramKeysToUpdate.push(key);
                    paramValuesToUpdate.push(body[key]);
                }
            }

            console.log("keys and values to be updated: ")
            console.log(paramKeysToUpdate)
            console.log(paramValuesToUpdate)
            const getResidence = await this.db.selectAll("ResidenceOwners", `id = ${resId} and userId = ${userId}`)

            console.log("checking if user is owner of following residence")
            console.log(getResidence)
            if(!getResidence.length) throw new Error("Trying to access not owned property!")

            const chgConfig: DbParams.updateParams = {table: "ResidenceOwners", id: resId, columns: paramKeysToUpdate, values: paramValuesToUpdate} 

            await this.db.update(chgConfig)

        }catch(e){
            console.log(e)
            throw e
        }
    }

}