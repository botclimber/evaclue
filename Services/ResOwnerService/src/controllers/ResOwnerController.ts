import {Request, Response, NextFunction} from "express"
import { errorMessages as err } from "../helpers/errorMessages"
import { ResidenceOwner } from "../models/ResidenceOwner"
import { isAuthz } from "../middlewares/authorization"
import { Db } from "../db/Db"
import { Address } from "../models/Address"
import { Residence } from "../models/Residence"
import axios from "axios"
import { genNewDate } from "../helpers/DateFormat"

type state = {state: number}

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

        const city: string | undefined = (req.query.city)? req.query.city.toString().toUpperCase() : undefined

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

            }else return res.status(err.NO_AVAILABILITY.status).json({msg: err.NO_AVAILABILITY.text})

        }else return res.status(err.ALL_REQUIRED.status).json({msg: err.ALL_REQUIRED.text})
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const data: Partial<ResidenceOwner & Address & Residence> & Required<middlewareTypes.JwtPayload> = req.body

        const exists: ResidenceOwner[] | undefined = await this.db.selectAll<ResidenceOwner>("ResidenceOwner", `userId = ${data.userId}`)
        if(exists){
            return res.status(err.CLAIMED_ALREADY.status).json({msg: err.CLAIMED_ALREADY.text})
        }

        const address: Partial<Address> = (data.lat && data.lng)? {lat: data.lat, lng: data.lng} : {city: data.city, street: data.street, nr: data.nr, postalCode: "0000-000", country: "Portugal"}
        const residence: Partial<Residence> = (data.floor && data.direction)? {floor: data.floor, direction: data.direction} : {}
	
        try{

            // Request to fileHandler service - send fileProof
            const fileName = `userProofOfRes-${data.userId}.pdf`

            // request addr and residence ids
            const response = await axios
                .post(`http://localhost:${process.env.geo_PORT}/v1/geoLocation/create`,{address: address, residence:  residence}, { headers: {"Content-Type": "application/json"}} )
            
            // check there are empty parameters
            const newResidenceOwner: ResidenceOwner = new ResidenceOwner(data.userId, 0, response.data.addrId, response.data.resId, data.rentPrice || 0.0, data.free || false, genNewDate(), genNewDate(), 0, true, fileName)
            
            const resOwnerId = await this.db.insert<ResidenceOwner>(newResidenceOwner)
            
            if(resOwnerId){
                console.log(`Record created with id: ${resOwnerId} !`)
                return res.status(200).json({msg: "Requested, we gonna analise it!"})
            
            }else return res.status(500).json({msg: "SOMETHING WENT WRONG!"})

        }catch(e){
            console.log(e)
            throw e
        }
    }

    /**
     * Update status for a claimed residence
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        // check if user is colaborator
        const claimId: number | undefined = parseInt(req.params.claimId)
        const body: Partial<state> & Required<middlewareTypes.JwtPayload> = req.body

        if(isAuthz(body.userType)){

            if(!claimId) return res.status(err.MISSING_PARAMS.status).json({msg: err.MISSING_PARAMS.text})

            const chgConfig: DbParams.updateParams = {table: "ResidenceOwners", id: claimId, columns: ["adminId", "approved", "approvedOn"], values: [body.userId, body.state || 0, genNewDate()]} 

            await this.db.update(chgConfig)
            return res.status(200).json({msg: "Residence state updated!"})
            
        }else return res.status(err.NO_PERMISSION.status).json({msg: err.NO_PERMISSION.text})
    }
}
