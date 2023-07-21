import {Request, Response, NextFunction} from "express"
import axios from "axios"
import { Review } from "../models/Review"
//import Db from "../db/Db"

/**
 * reviews - get all reviews | parameters?
 * create
 * update - e.g. when admin wants to approve a review | needs to check userType
 */

export class ReviewsController {
    async reviews(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        return res.status(200).json()
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void>{


        return res.status(200).json()
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

        return res.status(200).json()
    }
}