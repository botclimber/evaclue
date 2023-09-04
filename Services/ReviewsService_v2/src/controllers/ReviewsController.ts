import {Request, Response, NextFunction} from "express"
import axios from "axios"
import { Reviews } from "../models/Reviews"
import { Addresses } from "../models/Addresses"
import { Residences } from "../models/Residences"
import { ReviewValidator } from "../middlewares/ReviewValidator"
import { genNewDate } from "../helpers/DateFormat"
import { isAuthz } from "../middlewares/authorization"
import { errorMessages as err } from "../helpers/errorMessages"
import { ReviewActions } from "./ReviewActions"
import fileUpload, { FileArray, UploadedFile } from "express-fileupload"

type updateReviewState = {decision: number}
type flag ={ flag: "fromMapClick" | undefined }
type reviewImgs = {
    reviewId?: number,
    reviewImgs?: fileUpload.FileArray
}

const reviewActions: ReviewActions = new ReviewActions();
export class ReviewsController {

    async reviews(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        try{
            const reviews: Reviews[] = await reviewActions.getReviews()
            return res.status(200).json({reviews: reviews})
        
        }catch(e){
            console.log(e)
            throw e
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        const data: Partial<Reviews & Addresses & Residences> & Required<middlewareTypes.JwtPayload> & flag & reviewImgs = req.body
        console.log(data)

        const address: Partial<Addresses> = {lat: data.lat, lng: data.lng, city: data.city, street: data.street, nr: data.nr, postalCode: "0000-000", country: "Portugal"}
        const residence: Partial<Residences> = (data.floor && data.direction)? {floor: data.floor, direction: data.direction} : {}

        try{
            console.log("Request creation of Address and Residence if not already existing and as response the IDs")
            console.log(address)
            console.log(residence)

            await axios
                .post(`http://localhost:${process.env.geo_PORT}/geo/v1/create`, {address: address, residence: residence}, { headers: {"Content-Type": "application/json"}} )
                .then( async (response) => {
                    
                    console.log("Start validation | check if user already reviewed this Property")
                    const revValidator = new ReviewValidator()
                    const reviewLimit = await revValidator.reviewLimit(data.userId, response.data.addrId)
                    
                    if(!reviewLimit){
                        const appr: number = (data.flag !== "fromMapClick")? 1: 0;
                        const rev = new Reviews(data.userId, 0, response.data.resId, data.review || "", data.rating || 5, genNewDate(), "1000-01-01 00:00:00", data.anonymous || false, appr)
                    
                        const revId = await reviewActions.create(rev)

                        if(revId) return res.status(200).json({msg: "New Review created!", revId: revId})
                        else return res.status(500).json({msg: "something went wrong when trying to insert review!"})

                    }else
                        return res.status(err.REPEATED_REVIEW.status).json({msg: err.REPEATED_REVIEW.text})
                    
                })
                .catch(err => {console.log(err); res.status(500).json({msg: "Someting went wrong!" }); })

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
        const revId: number | undefined  = parseInt(req.params.revId)
        const data: Required<middlewareTypes.JwtPayload & updateReviewState> = req.body

        if(!revId) return res.status(err.MISSING_PARAMS.status).json({msg: err.MISSING_PARAMS.text})

        if(isAuthz(data.userType)){

            try{

                await reviewActions.update(revId, data.decision, data.userId)
                return res.status(200).json({msg: "Row updated!"})
            
            }catch(e){
                console.log(e)
                throw e
            }
        
        }else return res.status(err.NO_PERMISSION.status).json({msg: err.NO_PERMISSION.text})
    }
}
