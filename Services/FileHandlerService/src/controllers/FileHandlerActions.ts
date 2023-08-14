import fileUpload, { UploadedFile } from "express-fileupload";
import * as path from "path";
import * as fs from "fs";

export class FileHandlerActions {

    rFolderPath: string = path.join(__dirname, "../reviewImgs/");
    resFolderPath: string = path.join(__dirname, "../resImgs/");
    pDocFolderPath: string = path.join(__dirname, "../proofDocs/");

    async saveReviewImgs(reviewId: number, files: fileUpload.FileArray): Promise<boolean>{
        console.log(files)

        try{

            console.log(`Check if path exists if not create it`)
            if(!fs.existsSync(this.rFolderPath)) fs.mkdirSync(this.rFolderPath)

            // create folder for the specific review containing images
            const newFolderName = `review-${reviewId}/`
            const newFolderPath = `${this.rFolderPath}${newFolderName}`
            
            if(!fs.existsSync(newFolderPath)) fs.mkdirSync(newFolderPath)
            else return false

            console.log(`Rename images and change its extension`)
            const eFiles = files.reviewImgs as UploadedFile[]
            for (const x in eFiles){
                const newFileName = `rImg-${x}.gif`;
                eFiles[x].name = newFileName;
            }

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