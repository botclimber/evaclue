import {Request, Response, NextFunction} from "express"
import { LocationHandler } from "./LocationHandler"

import { Addresses } from "../models/Addresses"
import { Residences } from "../models/Residences"

import { AddressActions } from "./AddressActions"
import { ResidenceActions } from "./ResidenceActions"

import { errorMessages as err } from "../helpers/errorMessages"

export class GeoLocation {

    /**
     * Create Location (Address and Residence) return address and residence ids
     * 
     * @param eq 
     * @param res 
     * @param next 
     */
    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const createSendResponse = async (addr: Addresses) => {
            const addrId = await new AddressActions().newAddress(addr)
            const residence: Residences = {addressId: addrId, floor: req.body.residence.floor, direction: req.body.residence.direction }
            const resId = await new ResidenceActions().newResidence(residence)

            res.status(200).json({msg: "Address and Residence row created!", addrId: addrId, resId: resId})
        }

        const addr = req.body.address as Addresses

        if(addr.lat === undefined && addr.lng === undefined){
            const locInstance = new LocationHandler({city: addr.city, street: addr.street, buildingNr: addr.nr})
            const latLng: locationFormats.latLng = await locInstance.getLatLng()

            if(latLng.lat !== undefined && latLng.lng !== undefined) createSendResponse({...latLng, ...addr});
            else{
                res.status(err.INVALID_LOCATION.status).json({msg: err.INVALID_LOCATION.text})
                throw Error(err.INVALID_LOCATION.text);
            }
        
        }else createSendResponse(addr);

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