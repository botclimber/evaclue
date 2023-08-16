// anonymous functions are not loaded into memory on compilation
// u can only use an anon function after declaration
import fileUpload, { UploadedFile } from "express-fileupload";
import * as fs from "fs";

export namespace fHelper {
    type orCreateFolder = (path: string) => Promise<boolean>
    export const orCreateFolder: orCreateFolder =  async (path) => {
        if(!fs.existsSync(path)){ 
            fs.mkdirSync(path)
            return false
        
        }else return true 
    }

    type rnExtension = (files: UploadedFile[], name: string, ext: string) => Promise<UploadedFile[]>
    export const rnExtension: rnExtension = async (files, name, ext) => {
    
        for (const x in files){
            const newFileName = `${name}-${x}.${ext}`;
            files[x].name = newFileName;
        }

        return files
    }

    type castFilesType = (files: fileUpload.FileArray) => Promise<UploadedFile[]>
    export const castFilesType: castFilesType = async (files) => {

        if(!Array.isArray(files.reviewImgs)) return [files.reviewImgs]
    
        return files.reviewImgs
    } 
}
