import {Request, Response, NextFunction} from "express"
import { errorMessages as err } from "../../../CommonUtils/src/helpers/errorMessages";
import { ResidenceOwners } from "../../../CommonUtils/src/models/ResidenceOwners";
import { isAuthz } from "../../../CommonUtils/src/middlewares/authorization";
import { Addresses } from "../../../CommonUtils/src/models/Addresses";
import { Residences } from "../../../CommonUtils/src/models/Residences";
import axios from "axios"
import { genNewDate } from "../../../CommonUtils/src/helpers/DateFormat";
import { ResOwnerActions } from "./ResOwnerActions"

const resOwnerActions = new ResOwnerActions()

// TODO: on claim residence check if its an already claimed one
export class ResOwnerController {

    async getByOwnerId(req: Request, res: Response, next: NextFunction):  Promise<Response | void> {
        const data: middlewareTypes.JwtPayload = req.body 
        
        console.log(data)
            try{
                const resOwners: ResidenceOwners[] = await resOwnerActions.getOwnedResidences(data.userId)
                return res.status(200).json({ownedResidences: resOwners})

            }catch(e){
                console.log(e)
                return res.status(500).json({msg: e})
            }
    }

    async resOwners(req: Request, res: Response, next: NextFunction):  Promise<Response | void> {
        const data: middlewareTypes.JwtPayload = req.body 
        
        console.log(data)
        if ( isAuthz(data.userType)){
            try{
                const resOwners: ResidenceOwners[] = await resOwnerActions.getResOwners()
                return res.status(200).json({residenceOwners: resOwners})

            }catch(e){
                console.log(e)
                throw e
            }
        
        }else return res.status(err.ADMIN_NOT_FOUND.status).json({msg: err.ADMIN_NOT_FOUND.text})
    }

    async getByCity(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const city: string | undefined = (req.query.city)? req.query.city.toString().toUpperCase() : undefined

        console.log(city)
        if(city){
            const dataToBeSent = await resOwnerActions.getByCity(city);
            return res.status(200).json(dataToBeSent)

        } return res.status(err.ALL_REQUIRED.status).json({msg: err.ALL_REQUIRED.text})
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const data: Partial<ResidenceOwners & Addresses & Residences> & Required<middlewareTypes.JwtPayload> & locationFormats.flag = req.body

        const address: Partial<Addresses & locationFormats.flag> = {lat: data.lat, lng: data.lng, city: data.city, street: data.street, nr: data.nr, postalCode: "0000-000", country: "Portugal", flag: data.flag}

        const residence: Partial<Residences> = (data.floor && data.direction)? {floor: data.floor, direction: data.direction} : {}
	
        try{
            await axios
                .post(`http://localhost:${process.env.geo_PORT}/geo/v1/create`, {address: address, residence: residence}, { headers: {"Content-Type": "application/json"}} )
                .then( async (response) => {
                    console.log("Request to GeoLocation Response: ")
                    console.log(response)

                    console.log("Checking if user already claimed on this location ...")
                    const exists = await resOwnerActions.exists(data.userId, response.data.addrId)
                    if(exists) return res.status(err.CLAIMED_ALREADY.status).json({msg: err.CLAIMED_ALREADY.text})
                        
                    // check there are empty parameters
                    const newResidenceOwner: ResidenceOwners = new ResidenceOwners(data.userId, 0, response.data.addrId, response.data.resId, data.rentPrice || 0.0, data.free || false, genNewDate(), "1000-01-01 00:00:00", 0, true)
                    
                    const resOwnerId = await resOwnerActions.create(newResidenceOwner)
                    return res.status(200).json({msg: "Requested, we gonna analise it!", claimId: resOwnerId}) 
                        
                })
                .catch(err => {
                    console.log(`Response from GeoLocation server: ${err}`); 
                    res.status(err.response.status).json({msg: err.response.data.msg });
                })

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
    async approve(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        // check if user is colaborator
        const claimId: number | undefined = parseInt(req.params.claimId)
        const body: globalTypes.updateResOwnerState & middlewareTypes.JwtPayload = req.body

        if(isAuthz(body.userType)){

            if(!claimId) return res.status(err.MISSING_PARAMS.status).json({msg: err.MISSING_PARAMS.text})

            console.log(claimId, JSON.stringify(body))
            await resOwnerActions.update(claimId, body)
            
            return res.status(200).json({msg: "Residence state updated!"})
            
        }else return res.status(err.NO_PERMISSION.status).json({msg: err.NO_PERMISSION.text})
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        // check if user is colaborator
        const resId: number | undefined = parseInt(req.params.resId)
        const body: DynamicObject<Partial<ResidenceOwners> & middlewareTypes.JwtPayload> = req.body

        console.log("Recieved body: ")
        console.log(body)

        if(!resId) return res.status(err.MISSING_PARAMS.status).json({msg: err.MISSING_PARAMS.text})
        
        console.log(resId, JSON.stringify(body))
        
        try{
        await resOwnerActions.updateByParams(resId, body)
        return res.status(200).json({msg: "Residence changes saved!"})
        
        }catch(e){
            console.log(e)
            return res.status(500).json({msg: e})
        }

    }
}
