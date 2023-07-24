import {Request, Response, NextFunction} from "express"
import { Db } from "../db/Db"
import { LocationHandler } from "./LocationHandler"

import { Address } from "../models/Address"
import { Residence } from "../models/Residence"
import { errorMessages as err } from "../helpers/errorMessages"

export class GeoLocation {
    db: Db
    constructor(){
        this.db = new Db();
    }

    async newAddress(addr: Address): Promise<number> {
        const exists: Required<Address>[] | undefined = await this.db.selectAll<Address>("Addresses", `lat=${addr.lat} and lng=${addr.lng}`)

        try{
            if(exists !== undefined){
                return exists[0].id

            }else{
                const newAddr = new Address(addr.lat, addr.lng, addr.city, addr.street, addr.nr, addr.postalCode, addr.country)
                const id: number =  await this.db.insert<Address>(newAddr)

                return id
            }
            
        }catch(e){

            console.log(e)
            throw e
        }
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


    /**
     * Create Location (Address and Residence) return address and residence ids
     * 
     * @param eq 
     * @param res 
     * @param next 
     */
    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const createSendResponse = async (addr: Address) => {
            const addrId = await this.newAddress(addr)
            const resId = await this.newResidence(addrId, req.body.residence as Residence)

            res.status(200).json({msg: "Address and Residence row created!", addrId: addrId, resId: resId})
        }

        const addr = req.body.address as Address

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
        const locHandler = new LocationHandler(req.body.address as locationFormats.location)
        const latLng: locationFormats.latLng = await locHandler.getLatLng()

        res.status(200).json({lat: latLng.lat, lng: latLng.lng })
    }   
}