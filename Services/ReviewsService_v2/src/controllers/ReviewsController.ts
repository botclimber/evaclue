import {Request, Response, NextFunction} from "express"

export class ReviewsController {
    async reviews(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        return res.status(200).json()
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        return res.status(200).json()
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void>{

        return res.status(200).json()
    }
}