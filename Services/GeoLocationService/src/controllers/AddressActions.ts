import {Request, Response, NextFunction} from "express"
import { Db } from "../db/Db";

import { Address } from "../models/Address";

export class AddressActions{
    db: Db
    constructor(){
        this.db = new Db();
    }

    async newAddress(addr: Address): Promise<number> {
        const exists: Required<Address>[] | undefined = await this.db.selectAll<Address>("Addresses", `lat=${addr.lat} and lng=${addr.lng}`)

        try{
            if(exists !== undefined){
                return exists[0].id

            }else{
                const newAddr = new Address(addr.lat, addr.lng, addr.city, addr.street, addr.nr, addr.postalCode, addr.country)
                const id: number =  await this.db.insert<Address>(newAddr)

                return id
            }
            
        }catch(e){

            console.log(e)
            throw e
        }
    }

    async getAddresses(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const addresses: Address[] = await this.db.selectAll<Address>("Addresses")
            return res.status(200).json({addresses: addresses})
        
        }catch(e){
            console.log(e)
            throw e
        }
    }
}