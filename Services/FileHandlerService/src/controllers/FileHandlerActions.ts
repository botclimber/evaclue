import { Db } from "../db/Db";
import fileUpload, { UploadedFile } from "express-fileupload";
import * as path from "path"

export class FileHandlerActions {

    db: Db;

    rFolderPath: string;
    resFolderPath: string;
    pDocFolderPath: string;

    constructor(){
        this.db = new Db();

        this.rFolderPath = path.join(__dirname, "../reviewImgs/")
        this.resFolderPath = path.join(__dirname, "../resImgs/")
        this.pDocFolderPath = path.join(__dirname, "../proofDocs/")
    }

    async addReviewImgs(reviewId: number, files: fileUpload.FileArray): Promise<boolean>{

        // check if path exists if not create it
        // create folder for the specific review containing images
        // change images extension to gif
        // rename images ???
        // save in db ???
        

        return true
    }

    async addResImgs(){}

    async addResDoc(){}

    async getAoOReviewImgs(){}

    async getAoOResImages(){}

    async getAoOResDocs(){}

}