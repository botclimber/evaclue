import { UploadedFile } from "express-fileupload";
import { fHelper } from "./FileHandlerHelper";
import { fileTypeStrings } from "../helpers/enums";
import {Db} from "../../../CommonUtils/src/db/Db";
import {ResidenceOwners} from "../../../CommonUtils/src/models/ResidenceOwners";
import {Reviews} from "../../../CommonUtils/src/models/Reviews";
import "../../../CommonUtils/src/types/globals";
import * as eva from "eva-functional-utils";
import fs from "fs";

export class FileHandlerActions {
    db: Db;
    constructor(){ this.db = new Db() }
    
    /**
     * 
     * Generic method to save images
     * 
     * @param id 
     * @param files 
     * @param limit 
     * @param prefix 
     * @param folderPath 
     * @returns 
     */
    async saveFiles(id: number, files: UploadedFile | UploadedFile[], limit: number, prefix: string, folderPath: string, fileType: fileTypeStrings, fileAlternativeName: string, table?: string): Promise<requestFormat.genericResponse>{
        // TODO: this function is ugly make it cleaner by maybe move change the way we handle profile image update

        try{

            console.log("Files to be processed:")
            console.log(files)

            const castedFiles: UploadedFile[] = (await fHelper.castFilesType(files)).filter(r => fHelper.onlyAllowed(r.mimetype, fileType))

            const currentImgs: number = (table)? (await this.db.selectAll<ResidenceOwners | Reviews>(table, `id = ${id}`))[0].imgs : 0;
            if(castedFiles.length === 0) return {status: 400, msg: "No files sent or not allowed extension"}
            if( (castedFiles.length + currentImgs) > limit) return {status: 400, msg: `We only accept at maximum ${limit} images!`}

            console.log(`Check if path exists if not create it`)
            await fHelper.orCreateFolder(folderPath)
            
            // create folder for the specific review containing images
            const newFolderName = `${prefix}-${id}/`
            const newFolderPath = (prefix !== "profile")? `${folderPath}${newFolderName}` : folderPath // case profile image we dont want to create new folders, atleast for the moment
            await fHelper.orCreateFolder(newFolderPath)
            
            console.log(`Rename images and change its extension`)
            const ext = await fHelper.alternativeExt(fileType)
            const eFiles = (ext)? await fHelper.rnExtension(castedFiles, fileAlternativeName, ext, currentImgs) : castedFiles

            console.log(eFiles)
            console.log(`moving file(s) to ${newFolderPath}`)
            const newFileName = eFiles.map(file => {
                const fileName = (prefix === "profile") ? `${fileAlternativeName}-${id}.${ext}` : file.name;

                file.mv(newFolderPath + fileName, (err: any) => {
                    if(err) throw err
                    else return true
                });

                // return new image file name
                if(prefix === "profile") return fileName
            })

            return {status: 200, msg: `${fileAlternativeName}(s) added!`, newFileName: newFileName[0]}

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async updateReviewImgsStatus(reviewId: number, nrImgs: number): Promise<boolean>{

        try{
            const toUpdate: DbParams.updateParams = {table: "Reviews", id: reviewId, columns: ["imgs"], values: [nrImgs]}
            await this.db.update(toUpdate)

            return true

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async updateResOwnerImgsStatus(resOwnerId: number, nrImgs: number): Promise<boolean>{

        try{
            const currentImgs = await this.db.selectAll<ResidenceOwners>("ResidenceOwners", `id = ${resOwnerId}`)
            console.log("Current number of images existing is: ")
            console.log(currentImgs)

            const newImgsNr: number = currentImgs[0].imgs + nrImgs
            const toUpdate: DbParams.updateParams = {table: "ResidenceOwners", id: resOwnerId, columns: ["imgs"], values: [newImgsNr]}
            await this.db.update(toUpdate)

            return true

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async updateProfileImgOnDB(userId: number, imgName: string): Promise<boolean>{
        try{

            const toUpdate: DbParams.updateParams = {table: "Users", id: userId, columns: ["image"], values: [imgName]}
            await this.db.update(toUpdate)

            return true

        }catch(e){
            console.log(e)
            throw e
        }
    }

    async deleteFile(id: number, table: string, imgNrToBeDeleted: number, path: string, prefix: string, fileName: string, fileType: fileTypeStrings): Promise<void> {

        try{
            // reduce from db 
            const currentImgs = (await this.db.selectAll<ResidenceOwners | Reviews>(table, `id = ${id}`))[0].imgs

            const toUpdate: DbParams.updateParams = {table: table, id: id, columns: ["imgs"], values: [currentImgs - 1]}
            await this.db.update(toUpdate)
            
            const ext = await fHelper.alternativeExt(fileType)
            const fullPath = `${path}${prefix}-${id}/`
            const file = `${fullPath}${fileName}-${imgNrToBeDeleted}.${ext}`
            if(fs.existsSync(file)) {
                fs.unlink(file, ( async err => { 
                    if (err) console.log(err);
                    else {
                        console.log(`\nDeleted file: ${file}`); 
                        
                        // TODO: reorder files
                        await fHelper.reorderFiles(fullPath, fileName, ext ?? ".undefined")
                    } 
                  }));  
            }else throw new Error("File not found!");

        }catch(e){
            console.log(e)
            throw e
        }
    }
}