import {Response} from "express"
import {Db} from "../../../../Db/Db"
import { UserFilters } from "../../../types/typeModels"

class FiltersCompanion {}

export class Filters {
    className: string = "Filters"
    private userFilters: UserFilters
    private res: Response

    constructor(data: UserFilters, res: Response){
        this.userFilters = data
        this.res = res
    }
    
    async setFilters(data: UserFilters & middlewareTypes.JwtPayload){

    }

    async getFilters(userId: number){
        
    }

}