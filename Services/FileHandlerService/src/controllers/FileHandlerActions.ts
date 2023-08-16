import fileUpload, { UploadedFile } from "express-fileupload";
import * as path from "path";
import { fHelper } from "./FileHandlerHelper";

export class FileHandlerActions {
    reviewFilePrefix: string = "review";
    resFilePrefix: string = "res";
    proofDocFilePrefix: string = "proofDoc"

    rFolderPath: string = path.join(__dirname, "../reviewImgs/");
    resFolderPath: string = path.join(__dirname, "../resImgs/");
    pDocFolderPath: string = path.join(__dirname, "../proofDocs/");

    async saveReviewImgs(reviewId: number, files: fileUpload.FileArray): Promise<boolean>{

        try{
            console.log(files)
            const castedFiles: UploadedFile[] = (await fHelper.castFilesType(files)).filter(r => fHelper.onlyAllowedImgs(path.extname(r.name)))

            if(castedFiles.length === 0) return false

            console.log(`Check if path exists if not create it`)
            await fHelper.orCreateFolder(this.rFolderPath)
            
            // create folder for the specific review containing images
            const newFolderName = `${this.reviewFilePrefix}-${reviewId}/`
            const newFolderPath = `${this.rFolderPath}${newFolderName}`
            const folderAlreadyExists = await fHelper.orCreateFolder(newFolderPath)
            if(folderAlreadyExists) return true
            
            console.log(`Rename images and change its extension`)
            const eFiles = await fHelper.rnExtension(castedFiles, "rImg", "gif")

            console.log(eFiles)
            console.log(`moving file(s) to ${newFolderPath}`)
            eFiles.forEach(file => {
                file.mv(newFolderPath + file.name, (err: any) => {
                    if(err) throw err
                    else return true
                });
            })

            return true

        }catch(e){
            console.log(e)
            throw e
        }
    }

    //async addResImgs(){}

    //async addResDoc(){}

    //async getAoOReviewImgs(){}

    //async getAoOResImages(){}

    //async getAoOResDocs(){}

}