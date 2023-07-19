import {Request, Response, NextFunction} from "express"
import { ResidenceOwner } from "../models/ResidenceOwner"

export class ResOwnerController {
    async resOwners(req: Request, res: Response, next: NextFunction):  Promise<Response | void> {
   
    }

    async getByCity(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    }

    /**
     * Update status for a claimed residence
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    }

}