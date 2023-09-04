import { Db } from "../db/Db";

import { Addresses } from "../models/Addresses";

export class AddressActions{
    db: Db
    constructor(){
        this.db = new Db();
    }

    async newAddress(addr: Addresses): Promise<number> {
        const exists: Required<Addresses>[] | undefined = await this.db.selectAll<Addresses>("Addresses", `lat=${addr.lat} and lng=${addr.lng}`)

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