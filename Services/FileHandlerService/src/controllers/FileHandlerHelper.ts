// anonymous functions are not loaded into memory on compilation
// u can only use an anon function after declaration
import fileUpload, { UploadedFile } from "express-fileupload";
import * as fs from "fs";
import { fileType, fileTypeStrings } from "../helpers/enums";

export namespace fHelper {
    type allowedExtensions = string[]

    export const allowedImgExtensions: allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"]
    export const allowedDocExtensions: allowedExtensions = [".pdf"]
   
    // Function signatures
    type orCreateFolder = (path: string) => Promise<boolean>
    type rnExtension = (files: UploadedFile[], name: string, ext: string) => Promise<UploadedFile[]>
    type castFilesType = (files: UploadedFile | UploadedFile[]) => Promise<UploadedFile[]>
    type onlyAllowed = (fExtension: string, fileType: fileTypeStrings) => boolean

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

        const content: UploadedFile[] = (!Array.isArray(files))? [files] : files
        return content

    }
    
    export const onlyAllowed: onlyAllowed = (fExt, fType) => {

        switch(fType) {
            case fileType.IMG: 
                return allowedImgExtensions.includes(fExt); 
            
            case fileType.DOC: 
                return allowedDocExtensions.includes(fExt); 

            case fileType.ATTACH: 
                return [...allowedImgExtensions, ...allowedDocExtensions].includes(fExt);

            default: return false;
        }
    }
}
