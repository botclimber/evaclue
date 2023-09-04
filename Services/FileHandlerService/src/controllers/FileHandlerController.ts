import {Request, Response, NextFunction} from "express"
import { FileHandlerActions } from "./FileHandlerActions"
import { errorMessages as err } from "../helpers/errorMessages";
import * as path from "path";
import { fileType, fileTypeStrings } from "../helpers/enums";

type folderConfig = {
    prefix: string,
    path: string,
    limit: number,
    fType: fileTypeStrings,
    paramName: string
}

const REVIEWS: folderConfig = {
    prefix: "review",
    path: path.join(__dirname, "../reviewImgs/"),
    limit: 3,
    fType: fileType.IMG,
    paramName: "reviewImgs"
}

const RESIDENCES: folderConfig = {
    prefix: "residence",
    path: path.join(__dirname, "../resImgs/"),
    limit: 5,
    fType: fileType.IMG,
    paramName: "resImgs"
}

const PROOFDOCS: folderConfig = {
    prefix: "proofDoc",
    path: path.join(__dirname, "../proofDocs/"),
    limit: 1,
    fType: fileType.DOC,
    paramName: "proofDocFiles"
}

const TICKETS: folderConfig = {
    prefix: "ticket",
    path: path.join(__dirname, "../ticketAttachments/"),
    limit: 1,
    fType: fileType.ATTACH,
    paramName: "ticketAttachFiles"
}

const fileHandler = new FileHandlerActions();

export class FileHandlerController {

    async addReviewImgs(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        const data: requestFormat.revFiles = req.body

        if(data.reviewId){
            if(!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(REVIEWS.paramName)){
                return res.status(err.NO_FILES_OR_KEY.status).json({msg: err.NO_FILES_OR_KEY.text})
                
            }else {
                try{
                    const content = (!Array.isArray(req.files.reviewImgs))? [req.files.reviewImgs] : req.files.reviewImgs
                    content.forEach(r => console.log(r))

                    const response = await fileHandler.saveFiles(data.reviewId, req.files[REVIEWS.paramName], REVIEWS.limit, REVIEWS.prefix, REVIEWS.path, REVIEWS.fType)
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
            return res.status(err.MISSING_ID_PARAM.status).json({msg: err.MISSING_ID_PARAM.text})
        }
    }

    async addResImgs(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const data: requestFormat.resFiles = req.body

        if(data.resId){
            if(!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(RESIDENCES.paramName)){
                return res.status(err.NO_FILES_OR_KEY.status).json({msg: err.NO_FILES_OR_KEY.text})

            }else {
                try{
                    const response = await fileHandler.saveFiles(data.resId, req.files[RESIDENCES.paramName], RESIDENCES.limit, RESIDENCES.prefix, RESIDENCES.path, RESIDENCES.fType)
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
            return res.status(err.MISSING_ID_PARAM.status).json({msg: err.MISSING_ID_PARAM.text})
        }

    }

    async addResDoc(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const data: requestFormat.resFiles = req.body

        if(data.resId){
            if(!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(PROOFDOCS.paramName)){
                return res.status(err.NO_FILES_OR_KEY.status).json({msg: err.NO_FILES_OR_KEY.text})

            }else {
                try{
                    const response = await fileHandler.saveFiles(data.resId, req.files[PROOFDOCS.paramName], PROOFDOCS.limit, PROOFDOCS.prefix, PROOFDOCS.path, PROOFDOCS.fType)
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
            return res.status(err.MISSING_ID_PARAM.status).json({msg: err.MISSING_ID_PARAM.text})
        }

    }

    async addTicketAttachment(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const data: requestFormat.ticketFiles = req.body

        if(data.ticketId){
            if(!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(TICKETS.paramName)){
                return res.status(err.NO_FILES_OR_KEY.status).json({msg: err.NO_FILES_OR_KEY.text})

            }else {
                try{
                    const response = await fileHandler.saveFiles(data.ticketId, req.files[TICKETS.paramName], TICKETS.limit, TICKETS.prefix, TICKETS.path, TICKETS.fType)
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
            return res.status(err.MISSING_ID_PARAM.status).json({msg: err.MISSING_ID_PARAM.text})
        }
    }

}