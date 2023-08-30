import {Request, Response, NextFunction} from "express"
import { errorMessages as err } from "../helpers/errorMessages"
import { ResidenceOwners } from "../models/ResidenceOwners"
import { isAuthz } from "../middlewares/authorization"
import { Addresses } from "../models/Addresses"
import { Residences } from "../models/Residences"
import axios from "axios"
import { genNewDate } from "../helpers/DateFormat"
import { ResOwnerActions } from "./ResOwnerActions"
import fileUpload from "express-fileupload"
import FormData from "form-data"

type docProof = {
    resId?: number,
    files?: fileUpload.FileArray
}

const resOwnerActions = new ResOwnerActions()

// TODO: on claim residence check if its an already claimed one
export class ResOwnerController {

    async resOwners(req: Request, res: Response, next: NextFunction):  Promise<Response | void> {
        const data: middlewareTypes.JwtPayload = req.body 
        
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

        if(city){
            const dataToBeSent = await resOwnerActions.getByCity(city);
            return res.status(200).json(dataToBeSent)

        } return res.status(err.ALL_REQUIRED.status).json({msg: err.ALL_REQUIRED.text})
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const data: Partial<ResidenceOwners & Addresses & Residences> & Required<middlewareTypes.JwtPayload> & docProof = req.body

        const exists = await resOwnerActions.exists(data.userId)
        if(exists) return res.status(err.CLAIMED_ALREADY.status).json({msg: err.CLAIMED_ALREADY.text})

        const address: Partial<Addresses> = (data.lat && data.lng)? {lat: data.lat, lng: data.lng} : {city: data.city, street: data.street, nr: data.nr, postalCode: "0000-000", country: "Portugal"}
        
        const residence: Partial<Residences> = (data.floor && data.direction)? {floor: data.floor, direction: data.direction} : {}
	
        try{
            // request addr and residence ids
            const response = await axios
                .post(`http://localhost:${process.env.geo_PORT}/v1/geoLocation/create`,{address: address, residence:  residence}, { headers: {"Content-Type": "application/json"}} )

            
            console.log("Request to GeoLocation Response: ")
            console.log(response)
            
            // check there are empty parameters
            const newResidenceOwner: ResidenceOwners = new ResidenceOwners(data.userId, 0, response.data.addrId, response.data.resId, data.rentPrice || 0.0, data.free || false, genNewDate(), "0000-00-00 00:00:00", 0, true, "???")
            
            const resOwnerId = await resOwnerActions.create(newResidenceOwner)
            
            if(resOwnerId){
                console.log(`Record created with id: ${resOwnerId} !`)

                const docData = new FormData()
                docData.append("resId", resOwnerId)
                docData.append("proofDocFiles", data.files)

                console.log("Handling document file ...")
                const result = await axios.post(`http://localhost:${process.env.fileHandler_PORT}/v1/fileHandler/addResDoc`, {body: docData as docProof})

                if(result.status === 200) return res.status(200).json({msg: "Requested, we gonna analise it!"})
                else return res.status(result.status).json({msg: result.data.msg})
            
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
        const body: globalTypes.updateResOwnerState = req.body

        if(isAuthz(body.userType)){

            if(!claimId) return res.status(err.MISSING_PARAMS.status).json({msg: err.MISSING_PARAMS.text})

            await resOwnerActions.update(claimId, body)
            
            return res.status(200).json({msg: "Residence state updated!"})
            
        }else return res.status(err.NO_PERMISSION.status).json({msg: err.NO_PERMISSION.text})
    }
}
