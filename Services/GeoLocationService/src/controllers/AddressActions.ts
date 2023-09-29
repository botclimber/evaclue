import { Db } from "../../../CommonUtils/src/db/Db";
import * as eva from "eva-functional-utils";
import { errorMessages } from "../../../CommonUtils/src/helpers/errorMessages";
import "../../../CommonUtils/src/types/globals";

import { Addresses } from "../../../CommonUtils/src/models/Addresses";

export class AddressActions{
    db: Db
    constructor(){
        this.db = new Db();
    }

    async newAddress(addr: Required<Addresses & locationFormats.flag>): Promise<number | errorTypes.errorMsg> {
        if(eva.isEmpty(addr.city) || eva.isEmpty(addr.street) || eva.isEmpty(addr.nr) || eva.isEmpty(addr.flag)) return errorMessages.NOT_VALID_ADDRESS;
        else{

            const operator: string | undefined = (addr.flag === "fromMapClick")? "or" :(addr.flag === "fromMarker")? "and" : undefined;

            if(operator){
                const exists: Required<Addresses>[] | undefined = await this.db.selectAll<Addresses>("Addresses", `(lat=${addr.lat} and lng=${addr.lng}) ${operator} (city="${addr.city}" and street="${addr.street}" and nr="${addr.nr}")`)

                try{
                    console.log("check if this address is already registed ...")
                    console.log(exists)
                    if(exists.length){
                        return exists[0].id
        
                    }else if(addr.flag === "fromMapClick"){
                        
                        const newAddr = new Addresses(addr.lat, addr.lng, addr.city, addr.street, addr.nr, addr.postalCode, addr.country)
                        const id: number =  await this.db.insert<Addresses>(newAddr)
        
                        return id
                            
                    }else return errorMessages.INVALID_MARKER_LOCATION
                    
                    }catch(e){
        
                        console.log(e)
                        throw e
                    }

            }else return errorMessages.INVALID_FLAG
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