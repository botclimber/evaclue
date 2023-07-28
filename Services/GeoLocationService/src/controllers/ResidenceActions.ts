import { Db } from "../db/Db";

import { Residences } from "../models/Residences";

export class ResidenceActions{
    db: Db
    constructor(){
        this.db = new Db();
    }

    async newResidence(res: Residences): Promise<number>{

        try{
            const floor = (res.floor) ? res.floor : "";
            const direction = (res.direction) ? res.direction : "";
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