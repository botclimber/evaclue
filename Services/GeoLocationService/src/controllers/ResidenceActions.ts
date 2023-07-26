import {Request, Response, NextFunction} from "express"
import { Db } from "../db/Db";

import { Residence } from "../models/Residence";

export class ResidenceActions{
    db: Db
    constructor(){
        this.db = new Db();
    }

    async newResidence(addrId: number, res: Residence): Promise<number>{

        try{
            const floor = (res.floor) ? res.floor : "";
            const direction = (res.direction) ? res.direction : "";
            const newResidence = new Residence(addrId, floor, direction)
            const id: number = await this.db.insert(newResidence)

            return id

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async getResidences(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const residences: Residence[] = await this.db.selectAll<Residence>("Residences")
            return res.status(200).json({residences: residences})
        
        }catch(e){
            console.log(e)
            throw e
        }
    }

}