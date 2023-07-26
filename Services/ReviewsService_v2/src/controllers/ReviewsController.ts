import {Request, Response, NextFunction} from "express"
import axios from "axios"
import { Review } from "../models/Review"
import { Address } from "../models/Address"
import { Residence } from "../models/Residence"
import { ReviewValidator } from "../middlewares/ReviewValidator"
import { Db } from "../db/Db"
import { genNewDate } from "../helpers/DateFormat"
import { isAuthz } from "../middlewares/authorization"
import { errorMessages as err } from "../helpers/errorMessages"

type updateReviewState = {adminId: number, decision: number}
type flag ={ flag: "fromMapClick" | undefined }

export class ReviewsController {
    db: Db;

    constructor(){
        this.db = new Db()
    }

    async reviews(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        try{
            const reviews: Review[] = await this.db.selectAll<Review>("Reviews")

            console.log("All reviews:")
            console.log(reviews)
            const filteredReviews = reviews.map(r => { 
                if(r.anonymous){
                    r.userName = "Anonymous"
                    r.userImage = "default.gif"
                }

                return r
            })

            console.log("filteredReviews: ")
            console.log(filteredReviews)

            return res.status(200).json({reviews: filteredReviews})
        
        }catch(e){
            console.log(e)
            throw e
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const data: Partial<Review & Address & Residence> & Required<middlewareTypes.JwtPayload> & flag = req.body

        const address: Partial<Address> = (data.lat && data.lng)? {lat: data.lat, lng: data.lng} : {city: data.city, street: data.street, nr: data.nr, postalCode: "0000-000", country: "Portugal"}

        const residence: Partial<Residence> = (data.floor && data.direction)? {floor: data.floor, direction: data.direction} : {}

        try{
            console.log("Request creation of Address and Residence if not already existing and as response the IDs")
            console.log(address)
            console.log(residence)

            await axios
                .post(`http://localhost:${process.env.not_PORT}/v1/geoLocation/create`, {address: address, residence: residence}, { headers: {"Content-Type": "application/json"}} )
                .then( async (response) => {
                    console.log("Start validation | check if user already reviewed this Property")
                    const revValidator = new ReviewValidator(this.db)
                    const reviewLimit = await revValidator.reviewLimit(data.userId, response.data.addrId)
                    
                    if(!reviewLimit){
                        const appr: number = (data.flag !== "fromMapClick")? 1: 0;
                        const rev = new Review(data.userId, data.userName, data.userImage, 0, response.data.resId, data.review || "", data.rating || 5, genNewDate(), genNewDate(), data.anonymous || false, appr )
                    
                        // TODO: assign insertId to const and send as a paremeter together with images to the fileHandler service
                        await this.db.insert<Review>(rev)

                        return res.status(200).json({msg: "New Review created, i guess!"})

                    }else
                        return res.status(403).json({msg: "You already made a review for this location. Wait until you are able to review it again."})
                    
                })
                .catch(err => {console.log(err); throw err})

        }catch(e){
            console.log(e)
            throw e
        }

    }

    /**
     * WARN:
     * his update is to be used specifcly to update review status (pending, approved, rejected) 
     *  
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const revId  = parseInt(req.params.revId)
        const data: Required<middlewareTypes.JwtPayload & updateReviewState> = req.body

        if(isAuthz(data.userType)){

            try{

            const chgConfig: DbParams.updateParams = {table: "Reviews", id: revId, columns: ["adminId", "approved", "approvedOn"], values: [data.adminId, data.decision, genNewDate()]}
            await this.db.update(chgConfig)

            return res.status(200).json({msg: "Row updated!"})
            
            }catch(e){
                console.log(e)
                throw e
            }
        
        }else return res.status(err.NO_PERMISSION.status).json({msg: err.NO_PERMISSION.text})
    }
}