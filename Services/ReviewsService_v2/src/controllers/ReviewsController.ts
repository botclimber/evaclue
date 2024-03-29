import {Request, Response, NextFunction} from "express"
import axios from "axios"
import { Reviews } from "../../../CommonUtils/src/models/Reviews";
import { Addresses } from "../../../CommonUtils/src/models/Addresses";
import { Residences } from "../../../CommonUtils/src/models/Residences";
import { ReviewValidator } from "../middlewares/ReviewValidator"
import { genNewDate } from "../../../CommonUtils/src/helpers/DateFormat"
import { isAuthz } from "../../../CommonUtils/src/middlewares/authorization";
import { errorMessages as err } from "../../../CommonUtils/src/helpers/errorMessages";
import { ReviewActions } from "./ReviewActions"
import fileUpload, { FileArray, UploadedFile } from "express-fileupload"
import * as eva from "eva-functional-utils";

type updateReviewState = {decision: number}
type reviewImgs = {
    reviewId?: number,
    reviewImgs?: fileUpload.FileArray
}

const reviewActions: ReviewActions = new ReviewActions();
export class ReviewsController {

    async deleteReview(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
            const revId: number = +req.body.revId // cast to number

            // check if revId is valid
            console.log("Checking if revId is valid ...")
            if(revId && revId > 0) {
                console.log(`Deleting review with id ${revId}`)
                await reviewActions.deleteRev(revId)
                return res.status(200).json({msg: "Review deleted!"})
            }
            else return res.status(400).json({msg: "Invalid review id!"})
            
        }catch(e){
            console.log(e)
            return res.status(500).json({msg: e})
        }
    }

    async reviews(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        try{
            // TODO: at the moment approved reviews are handle on client side. Maybe depending on user type return only approved reviews and also on backend filtered anonymous user info
            const reviews: Reviews[] = await reviewActions.getReviews()
            return res.status(200).json({reviews: reviews})
        
        }catch(e){
            console.log(e)
            throw e
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        const data: Partial<Reviews & Addresses & Residences> & Required<middlewareTypes.JwtPayload> & locationFormats.flag & reviewImgs = req.body
        console.log(data)

        const address: Partial<Addresses & locationFormats.flag> = {lat: data.lat, lng: data.lng, city: data.city, street: data.street, nr: data.nr, postalCode: "0000-000", country: "Portugal", flag: data.flag}
        const residence: Partial<Residences> = (data.floor && data.direction)? {floor: data.floor, direction: data.direction} : {}

        if(eva.isEmpty(data.review)) res.status(400).json({msg: `Review is empty!` });
        else{
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
                        
                        // TODO: enable review limit
                        //if(!reviewLimit){
                        if(true){
                            const appr: number = (data.flag !== "fromMapClick")? 1: 0;
                            const rev = new Reviews(data.userId, 0, response.data.resId, data.review || "", data.rating || 5, genNewDate(), "1000-01-01 00:00:00", data.anonymous || false, appr)
                        
                            const revId = await reviewActions.create(rev)

                            if(revId) return res.status(200).json({msg: "New Review created!", revId: revId})
                            else return res.status(500).json({msg: "something went wrong when trying to insert review!"})

                        }else
                            return res.status(err.REPEATED_REVIEW.status).json({msg: err.REPEATED_REVIEW.text})
                        
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
