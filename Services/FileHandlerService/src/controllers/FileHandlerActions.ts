import fileUpload, { UploadedFile } from "express-fileupload";
import * as path from "path";
import { fHelper } from "./FileHandlerHelper";
import { fileTypeStrings } from "../helpers/enums";

export class FileHandlerActions {
    
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
    async saveFiles(id: number, files: UploadedFile | UploadedFile[], limit: number, prefix: string, folderPath: string, fileType: fileTypeStrings): Promise<requestFormat.genericResponse>{

        try{
            console.log(files)

            const castedFiles: UploadedFile[] = (await fHelper.castFilesType(files)).filter(r => fHelper.onlyAllowed(path.extname(r.name), fileType))

            if(castedFiles.length === 0) return {status: 400, msg: "No files sent or not allowed extension"}

            if(castedFiles.length > limit) return {status: 400, msg: `We only accept at maximum ${limit} images!`}

            console.log(`Check if path exists if not create it`)
            await fHelper.orCreateFolder(folderPath)
            
            // create folder for the specific review containing images
            const newFolderName = `${prefix}-${id}/`
            const newFolderPath = `${folderPath}${newFolderName}`
            const folderAlreadyExists = await fHelper.orCreateFolder(newFolderPath)
            if(folderAlreadyExists) return {status: 400, msg: `Folder for that ${prefix} id already existing!`}
            
            console.log(`Rename images and change its extension`)
            const ext = await fHelper.alternativeExt(fileType)
            const eFiles = (ext)? await fHelper.rnExtension(castedFiles, "rImg", ext) : castedFiles

            console.log(eFiles)
            console.log(`moving file(s) to ${newFolderPath}`)
            eFiles.forEach(file => {
                file.mv(newFolderPath + file.name, (err: any) => {
                    if(err) throw err
                    else return true
                });
            })

            return {status: 200, msg: "Images added!"}

        }catch(e){
            console.log(e)
            throw e
        }
    }
}