/**
 * 
 * reviews:
 *  - multiple images (max 3)
 * 
 * residences:
 *  - multiple images (max 5)
 * 
 * residenceOwners:
 *  - one document proof
 */

import {Request, Response, NextFunction} from "express"
import { FileHandlerActions } from "./FileHandlerActions"

export class FileHandlerController {
    FH: FileHandlerActions;

    constructor(){
        this.FH = new FileHandlerActions();
    }

    async addReviewImgs(){}

    async addResidenceImgs(){}

    async addResDoc(){}

    async getAoOReviewImgs(){}

    async getAoOResImages(){}

    async getAoOResDocs(){}
}