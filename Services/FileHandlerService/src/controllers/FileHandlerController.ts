import {Request, Response, NextFunction} from "express"
import { FileHandlerActions } from "./FileHandlerActions"
import { errorMessages as err } from "../../../CommonUtils/src/helpers/errorMessages";
import * as path from "path";
import { fileType, fileTypeStrings } from "../helpers/enums";
import * as eva from "eva-functional-utils";

type folderConfig = {
    prefix: string,
    fileAlternativeName: string,
    path: string,
    limit: number,
    fType: fileTypeStrings,
    paramName: string
}

const REVIEWS: folderConfig = {
    prefix: "review",
    fileAlternativeName: "rImg",
    path: path.join(__dirname, "../../../../../../../evaclueFrontEnd/assets/images/reviewImgs/"),
    limit: 3,
    fType: fileType.IMG,
    paramName: "reviewImgs"
}

const RESIDENCES: folderConfig = {
    prefix: "residence",
    fileAlternativeName: "img",
    path: path.join(__dirname, "../../../../../../../evaclueFrontEnd/assets/images/resImgs/"),
    limit: 5,
    fType: fileType.IMG,
    paramName: "resImgs"
}

const PROOFDOCS: folderConfig = {
    prefix: "proofDoc",
    fileAlternativeName: "doc",
    path: path.join(__dirname, "../../../../../../Views/Admin/public/assets/images/proofDocs/"),
    limit: 1,
    fType: fileType.DOC,
    paramName: "proofDocFiles"
}

const TICKETS: folderConfig = {
    prefix: "ticket",
    fileAlternativeName: "ticket",
    path: path.join(__dirname, "../ticketAttachments/"),
    limit: 1,
    fType: fileType.ATTACH,
    paramName: "ticketAttachFiles"
}

const fileHandler = new FileHandlerActions();

export class FileHandlerController {

    async addReviewImgs(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        const data: requestFormat.revFiles = req.body

        console.log("Data to be handle:")
        console.log(data)

        if(data.reviewId){
            if(!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(REVIEWS.paramName)){
                return res.status(err.NO_FILES_OR_KEY.status).json({msg: err.NO_FILES_OR_KEY.text})
                
            }else {
                try{
                    const imgs = req.files[REVIEWS.paramName] || []

                    const content = (!Array.isArray(imgs))? [imgs] : imgs
                    content.forEach(r => console.log(r))

                    const response = await fileHandler.saveFiles(data.reviewId, imgs, REVIEWS.limit, REVIEWS.prefix, REVIEWS.path, REVIEWS.fType, REVIEWS.fileAlternativeName)
                    console.log(response)
                    
                    if(response.status === 200){
                        //update review hasImgs column value
                        const update = eva.Try.evaluate(async () => await fileHandler.updateReviewImgsStatus(data.reviewId, content.length));

                        if(update.itSucceed()) return res.status(response.status).json({msg: response.msg})
                        else return res.status(500).json({msg: "something went wrong when trying to update column (hasImgs)"})
                    }else
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
                    const response = await fileHandler.saveFiles(data.resId, req.files[RESIDENCES.paramName], RESIDENCES.limit, RESIDENCES.prefix, RESIDENCES.path, RESIDENCES.fType, RESIDENCES.fileAlternativeName)
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
                    const response = await fileHandler.saveFiles(data.resId, req.files[PROOFDOCS.paramName], PROOFDOCS.limit, PROOFDOCS.prefix, PROOFDOCS.path, PROOFDOCS.fType, PROOFDOCS.fileAlternativeName)
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
                    const response = await fileHandler.saveFiles(data.ticketId, req.files[TICKETS.paramName], TICKETS.limit, TICKETS.prefix, TICKETS.path, TICKETS.fType, TICKETS.fileAlternativeName)
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