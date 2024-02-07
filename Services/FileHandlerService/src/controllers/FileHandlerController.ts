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
    paramName: string,
    table: string
}

const REVIEWS: folderConfig = {
    prefix: "review",
    fileAlternativeName: "rImg",
    path: path.join(__dirname, "../../../../../../../evaclueFrontEnd/assets/images/reviewImgs/"),
    limit: 3,
    fType: fileType.IMG,
    paramName: "reviewImgs",
    table: "Reviews"
}

const RESIDENCES: folderConfig = {
    prefix: "residence",
    fileAlternativeName: "img",
    path: path.join(__dirname, "../../../../../../../evaclueFrontEnd/assets/images/resImgs/"),
    limit: 5,
    fType: fileType.IMG,
    paramName: "resImgs",
    table: "ResidenceOwners"
}

const PROOFDOCS: folderConfig = {
    prefix: "proofDoc",
    fileAlternativeName: "doc",
    path: path.join(__dirname, "../../../../../../Views/Admin/public/assets/images/resProofFiles/"),
    limit: 1,
    fType: fileType.DOC,
    paramName: "proofDocFiles",
    table: ""
}

const TICKETS: folderConfig = {
    prefix: "ticket",
    fileAlternativeName: "ticket",
    path: path.join(__dirname, "../ticketAttachments/"),
    limit: 1,
    fType: fileType.ATTACH,
    paramName: "ticketAttachFiles",
    table: ""
}

const PROFILE: folderConfig = {
    prefix: "profile",
    fileAlternativeName: "user",
    path: path.join(__dirname, "../../../../../../../evaclueFrontEnd/assets/images/userImages/"),
    limit: 1,
    fType: fileType.IMG,
    paramName: "profileImg",
    table: "Users"
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

                    const response = await fileHandler.saveFiles(data.reviewId, imgs, REVIEWS.limit, REVIEWS.prefix, REVIEWS.path, REVIEWS.fType, REVIEWS.fileAlternativeName, REVIEWS.table)
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
                    const imgs = req.files[RESIDENCES.paramName] || []

                    const content = (!Array.isArray(imgs))? [imgs] : imgs
                    content.forEach(r => console.log(r))

                    const response = await fileHandler.saveFiles(data.resId, req.files[RESIDENCES.paramName], RESIDENCES.limit, RESIDENCES.prefix, RESIDENCES.path, RESIDENCES.fType, RESIDENCES.fileAlternativeName, RESIDENCES.table)
                    console.log(response)
                    
                    if(response.status === 200){
                        //update review hasImgs column value
                        const update = eva.Try.evaluate(async () => await fileHandler.updateResOwnerImgsStatus(data.resId, content.length));

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

    async deleteResFile(req: Request, res: Response, next: NextFunction){
        try{
            const id: number = parseInt(req.params.id)
            const imgNr: number = parseInt(req.params.imgNr)

            console.log(`Params recieved: Residence Owner ID: ${id} | Imgs Number: ${imgNr}`)

            if(!id || imgNr == undefined) return res.status(400).json({msg: "required parameters missing!"});
            else{

                await fileHandler.deleteFile(id, RESIDENCES.table, imgNr, RESIDENCES.path, RESIDENCES.prefix, RESIDENCES.fileAlternativeName, RESIDENCES.fType)
                res.status(200).json({msg:"File removed!"});

            }

        }catch(e){
            console.log(e)
            
            if(e instanceof Error) res.status(500).json({msg: e.message})
            else res.status(500).json({msg: String(e)})
        }
    }

    async addResDoc(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const data: requestFormat.resFiles = req.body
        console.log(`Trying to save a ${PROOFDOCS.prefix} file`)
        console.log(data)

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

    async changeUserProfileImg(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        const data: requestFormat.profileFiles = req.body

        if(data.userId){
            if(!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(PROFILE.paramName)){
                return res.status(err.NO_FILES_OR_KEY.status).json({msg: err.NO_FILES_OR_KEY.text})

            }else {
                try{
                    const response = await fileHandler.saveFiles(data.userId, req.files[PROFILE.paramName], PROFILE.limit, PROFILE.prefix, PROFILE.path, PROFILE.fType, PROFILE.fileAlternativeName)
                    console.log(response)
                    
                    if(response.status === 200){
                        //update review hasImgs column value
                        const fileName = response.newFileName || "default.gif"
                        const update = eva.Try.evaluate(async () => await fileHandler.updateProfileImgOnDB(data.userId, fileName));

                        if(update.itSucceed()) return res.status(response.status).json({msg: response.msg, fileName: fileName})
                        else return res.status(500).json({msg: `something went wrong when trying to update column (image) from table (${PROFILE.table})`})
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

}