import { Db } from "../../../CommonUtils/src/db/Db";
import "../../../CommonUtils/src/types/globals";

import { Residences } from "../../../CommonUtils/src/models/Residences";

export class ResidenceActions{
    db: Db
    constructor(){
        this.db = new Db();
    }

    async newResidence(res: Residences): Promise<number>{

        try{
            const floor = (res.floor) ? res.floor : "";
            const direction = (res.direction) ? res.direction : "";

            const exists: Required<Residences>[] | undefined = await this.db.selectAll<Residences>("Residences", `addressId = ? and floor = ? and direction = ? `, [res.addressId, floor, direction])

            if(exists && exists.length > 0) return exists[0].id;

            const newResidence = new Residences(res.addressId, floor, direction)
            const id: number = await this.db.insert(newResidence)

            return id

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async getResidences(): Promise<Residences[]> {
        try{
            const residences: Residences[] = await this.db.selectAll<Residences>("Residences")
            return residences
        
        }catch(e){
            console.log(e)
            throw e
        }
    }

}