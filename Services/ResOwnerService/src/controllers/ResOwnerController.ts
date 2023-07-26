import {Request, Response, NextFunction} from "express"
import { errorMessages as err } from "../helpers/errorMessages"
import { ResidenceOwner } from "../models/ResidenceOwner"
import { isAuthz } from "../middlewares/authorization"
import { Db } from "../db/Db"
import { Address } from "../models/Address"

export class ResOwnerController {
    db: Db
    constructor(){
        this.db = new Db();
    }

    async resOwners(req: Request, res: Response, next: NextFunction):  Promise<Response | void> {
        const data: middlewareTypes.JwtPayload = req.body 
        
        if ( isAuthz(data.userType)){
            try{
                const resOwners: ResidenceOwner[] = await this.db.selectAll<ResidenceOwner>("ResidenceOwners")
                return res.status(200).json({residenceOwners: resOwners})

            }catch(e){
                console.log(e)
                throw e
            }
        
        }else return res.status(err.ADMIN_NOT_FOUND.status).json({msg: err.ADMIN_NOT_FOUND.text})
    }

    async getByCity(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const city: Uppercase<string> | undefined = req.body.toUpperCase()

        if(city){
    
            const addresses: Required<Address>[] = await this.db.selectAll<Address>("Addresses", `upper(city) = ${city}`)
            const addressesMap = new Map<number, Address>()
            addresses.forEach(r => addressesMap.set(r.id, r))

            const resOwners: ResidenceOwner[] = await this.db.selectAll<ResidenceOwner>("ResidenceOwners")
            const filteredResOwners = resOwners.filter(r => r.free && r.approved === 1 && Array.from(addressesMap.keys()).includes(r.addressId))

            if(filteredResOwners.length){
                const dataToBeSent = filteredResOwners.map(row => {
                    const addr: Address | undefined = addressesMap.get(row.addressId)

                    return {...row, ...addr}
                })

                return res.status(200).json(dataToBeSent)

            }else res.status(err.NO_AVAILABILITY.status).json({msg: err.NO_AVAILABILITY.text})

        }else res.status(err.ALL_REQUIRED.status).json({msg: err.ALL_REQUIRED.text})
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    }

    /**
     * Update status for a claimed residence
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    }

}