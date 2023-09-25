import { Db } from "../db/Db";
import * as eva from "eva-functional-utils";
import { errorMessages } from "../helpers/errorMessages";

import { Addresses } from "../models/Addresses";

export class AddressActions{
    db: Db
    constructor(){
        this.db = new Db();
    }

    async newAddress(addr: Addresses): Promise<number | errorTypes.errorMsg> {
        if(eva.isEmpty(addr.city) && eva.isEmpty(addr.street) && eva.isEmpty(addr.nr)) return errorMessages.NOT_VALID_ADDRESS;
        else{

            const exists: Required<Addresses>[] | undefined = await this.db.selectAll<Addresses>("Addresses", `(lat=${addr.lat} and lng=${addr.lng}) or (city="${addr.city}" and street="${addr.street}" and nr="${addr.nr}")`)

        try{
            console.log("check if this address is already registed ...")
            console.log(exists)
            if(exists.length){
                return exists[0].id

            }else{
                
                const newAddr = new Addresses(addr.lat, addr.lng, addr.city, addr.street, addr.nr, addr.postalCode, addr.country)
                const id: number =  await this.db.insert<Addresses>(newAddr)

                return id
                    
            }
            
            }catch(e){

                console.log(e)
                throw e
            }
        
        }
    }

    async getAddresses(): Promise<Addresses[]> {
        try{
            const addresses: Addresses[] = await this.db.selectAll<Addresses>("Addresses")
            return addresses
        
        }catch(e){
            console.log(e)
            throw e
        }
    }
}