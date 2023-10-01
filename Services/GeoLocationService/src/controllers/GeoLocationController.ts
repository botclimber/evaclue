import {Request, Response, NextFunction} from "express"
import { LocationHandler } from "./LocationHandler"
import "../../../CommonUtils/src/types/globals";

import { Addresses } from "../../../CommonUtils/src/models/Addresses";
import { Residences } from "../../../CommonUtils/src/models/Residences";

import { AddressActions } from "./AddressActions"
import { ResidenceActions } from "./ResidenceActions"

import { errorMessages as err } from "../../../CommonUtils/src/helpers/errorMessages";

export class GeoLocation {

    /**
     * Create Location (Address and Residence) return address and residence ids
     * 
     * @param eq 
     * @param res 
     * @param next 
     */
    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const createSendResponse = async (addr: Required<Addresses & locationFormats.flag> & Residences) => {

                console.log("Trying to create or get address ...")
                const addrId = await new AddressActions().newAddress(addr)
                console.log(`address id is ${JSON.stringify(addrId)}`)

                console.log("Trying to create residence ...")
                if(typeof(addrId) === "number"){
                    const residence: Residences = {addressId: addrId, floor: addr.floor, direction: addr.direction }
                    const resId = await new ResidenceActions().newResidence(residence)

                    res.status(200).json({msg: "Address and Residence row created!", addrId: addrId, resId: resId})
                
                }else res.status(addrId.status).json({msg: addrId.text});
                
            }

            const addr = req.body.address as Required<Addresses & locationFormats.flag>
            const residence = req.body.residence as Residences

            console.log(addr)
            console.log(residence)

            if(!addr.lat && !addr.lng){
                const locInstance = new LocationHandler({city: addr.city, street: addr.street, buildingNr: addr.nr})
                const latLng: locationFormats.latLng = await locInstance.getLatLng()

                console.log("Maps returned coords:")
                console.log(latLng)
                if(latLng.lat && latLng.lng) await createSendResponse({...latLng, ...addr, ...residence});
                else{
                    res.status(err.INVALID_LOCATION.status).json({msg: err.INVALID_LOCATION.text})
                    throw Error(err.INVALID_LOCATION.text);
                }
            
            }else await createSendResponse({...addr, ...residence});
        }catch(e){
            console.log(e)
            return res.status(500).json({msg: e})
        }
    }


    /**
     * Retrieve a specific location (city or/and street or/and building nr)
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    async search(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        // TODO: check if city, street bNr already exists in database before requesting coords to maps api
        console.log(req.query)
        const locHandler = new LocationHandler(req.query as locationFormats.location)
        const latLng: locationFormats.latLng = await locHandler.getLatLng()

        res.status(200).json({lat: latLng.lat, lng: latLng.lng })
    }   

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getAddresses(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const addresses: Addresses[] = await new AddressActions().getAddresses()
            return res.status(200).json({addresses: addresses})

        }catch(e){
            console.log(e)
            throw e
        }
        
    }

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async getResidences(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const residences: Residences[] = await new ResidenceActions().getResidences()
            return res.status(200).json({residences: residences})
            
        }catch(e){
            console.log(e)
            throw e
        }
        
    }
}