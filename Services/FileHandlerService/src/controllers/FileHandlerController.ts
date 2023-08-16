import {Request, Response, NextFunction} from "express"
import { FileHandlerActions } from "./FileHandlerActions"
import { errorMessages as err } from "../helpers/errorMessages";
import * as path from "path";

type folderConfig = {
    prefix: string,
    path: string,
    limit: number
}

const REVIEWS: folderConfig = {
    prefix: "review",
    path: path.join(__dirname, "../reviewImgs/"),
    limit: 3
}

const RESIDENCES: folderConfig = {
    prefix: "residence",
    path: path.join(__dirname, "../resImgs/"),
    limit: 5
}

const PROOFDOCS: folderConfig = {
    prefix: "proofDoc",
    path: path.join(__dirname, "../proofDocs/"),
    limit: 1
}

const TICKETS: folderConfig = {
    prefix: "ticket",
    path: path.join(__dirname, "../ticketAttachments/"),
    limit: 1
}

const fileHandler = new FileHandlerActions();

export class FileHandlerController {

    async addReviewImgs(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        const data: requestFormat.addReviewImgs = req.body

        if(data.reviewId){
            if(!req.files || Object.keys(req.files).length === 0){
                return res.status(err.NO_FILES_FOUND.status).json({msg: err.NO_FILES_FOUND.text})

            }else {
                try{
                    const response = await fileHandler.saveImgFiles(data.reviewId, req.files, REVIEWS.limit, REVIEWS.prefix, REVIEWS.path)
                    console.log(response)
                    
                    if(response.status === 200)
                        return res.status(response.status).json({msg: response.msg})
                    else
                        return res.status(response.status).json({msg: response.msg})

                }catch(e){
                    console.log(e)
                    throw e
                }
            }

        }else{
            return res.status(err.MISSING_REV_ID.status).json({msg: err.MISSING_REV_ID.text})
        }
    }

    //async addResImgs(){}

    //async addResDoc(){}

    //async addTicketAttachment(){}

}