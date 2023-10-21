// anonymous functions are not loaded into memory on compilation
// u can only use an anon function after declaration
import fileUpload, { UploadedFile } from "express-fileupload";
import * as fs from "fs";
import { fileType, fileTypeStrings } from "../helpers/enums";

export namespace fHelper {
    type allowedExtensions = string[]

    export const allowedImgExtensions: allowedExtensions = ["image/jpg", "image/jpeg", "image/png", "image/gif"]    
    export const allowedDocExtensions: allowedExtensions = ["application/pdf"]
   
    // Function signatures
    type orCreateFolder = (path: string) => Promise<boolean>
    type rnExtension = (files: UploadedFile[], name: string, ext: string, nrExistingImgs: number) => Promise<UploadedFile[]>
    type castFilesType = (files: UploadedFile | UploadedFile[]) => Promise<UploadedFile[]>
    type onlyAllowed = (fExtension: string, fileType: fileTypeStrings) => boolean
    type alternativeExt = (fType: fileTypeStrings) => Promise<string | undefined>
    type reorderFiles = (path: string, filePrefix: string, ext: string) => Promise<void>

    export const orCreateFolder: orCreateFolder =  async (path) => {
        if(!fs.existsSync(path)){ 
            fs.mkdirSync(path)
            return false
        
        }else return true 
    }
    
    export const rnExtension: rnExtension = async (files, name, ext, nrExistingImgs) => {
    
        for (const x in files){
            const imgNr: number = parseInt(x) + nrExistingImgs
            const newFileName = `${name}-${imgNr}.${ext}`;
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

    export const alternativeExt: alternativeExt = async (fType) => {
        switch(fType) {
            case fileType.IMG: 
                return "gif"; 
            
            case fileType.DOC: 
                return "pdf"; 

            default: return undefined;
        }
    }

    export const reorderFiles: reorderFiles = async (path, filePrefix, ext) => {

        const files: string[] = fs.readdirSync(path)

        console.log(`Iterating over existing files in dir ${path}`)
        console.log(`files found:`)
        console.log(files)
        files.forEach( (v, i) => {
            console.log(v)
            console.log(i)

            const oldFileName = `${path}${v}`
            const newFileName = `${path}${filePrefix}-${i}.${ext}`

            console.log(`Rename file ${oldFileName} to ${newFileName}`)
        
            fs.rename(oldFileName, newFileName, (err) => {
                if(err) throw err
                console.log("Rename Complete!")
            })
        })
    }
}
