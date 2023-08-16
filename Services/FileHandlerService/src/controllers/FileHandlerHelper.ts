// anonymous functions are not loaded into memory on compilation
// u can only use an anon function after declaration
import fileUpload, { UploadedFile } from "express-fileupload";
import * as fs from "fs";

export namespace fHelper {
    type allowedExtensions = string[]

    export const allowedImgExtensions: allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"]
    export const allowedDocExtensions: allowedExtensions = [".pdf"]
   
    // Function signatures
    type orCreateFolder = (path: string) => Promise<boolean>
    type rnExtension = (files: UploadedFile[], name: string, ext: string) => Promise<UploadedFile[]>
    type castFilesType = (files: fileUpload.FileArray) => Promise<UploadedFile[]>
    type onlyAllowedImgs = (fExtension: string) => boolean
    type onlyAllowedDocs = (fExtension: string) => boolean

    export const orCreateFolder: orCreateFolder =  async (path) => {
        if(!fs.existsSync(path)){ 
            fs.mkdirSync(path)
            return false
        
        }else return true 
    }
    
    export const rnExtension: rnExtension = async (files, name, ext) => {
    
        for (const x in files){
            const newFileName = `${name}-${x}.${ext}`;
            files[x].name = newFileName;
        }

        return files
    }

    export const castFilesType: castFilesType = async (files) => {

        if(!Array.isArray(files.reviewImgs)) return [files.reviewImgs]
    
        return files.reviewImgs
    }
    
    export const onlyAllowedImgs: onlyAllowedImgs = (fExt) => {
        if (allowedImgExtensions.includes(fExt)) return true
        else return false
    }

    export const onlyAllowedDocs: onlyAllowedImgs = (fExt) => {
        if (allowedDocExtensions.includes(fExt)) return true
        else return false
    }
}
