/**
 * 
 * reviews:
 *  - multiple images (max 3)
 * 
 * residences:
 *  - multiple images (max 5)
 * 
 * residenceOwners:
 *  - one document proof
 */

import {Request, Response, NextFunction} from "express"
import { FileHandlerActions } from "./FileHandlerActions"
import { errorMessages as err } from "../helpers/errorMessages";

export class FileHandlerController {
    FH: FileHandlerActions;

    constructor(){
        this.FH = new FileHandlerActions();
    }

    async addReviewImgs(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        const data: requestFormat.addReviewImgs = req.body

        if(data.reviewId){
            if(!req.files || Object.keys(req.files).length === 0) return res.status(err.NO_FILES_FOUND.status).json({msg: err.NO_FILES_FOUND.text});

            else { 
                try{
                    const response = await this.FH.addReviewImgs(data.reviewId, req.files)
                    return res.status(200).json({msg: `Images added!`})

                }catch(e){
                    console.log(e)
                    throw e
                }
            }

        }else{
            return res.status(err.MISSING_REV_ID.status).json({msg: err.MISSING_REV_ID.text})
        }

    }

    async addResImgs(){}

    async addResDoc(){}

    async getAoOReviewImgs(){}

    async getAoOResImages(){}

    // Only an admin or the file user owner should be able to request a document
    async getAoOResDocs(){}
}