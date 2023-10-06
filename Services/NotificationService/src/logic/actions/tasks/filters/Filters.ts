import {Response} from "express"
import {Db} from "../../../../Db/Db"
import { User, UserFilters } from "../../../types/typeModels"
import * as eva from "eva-functional-utils"
import { FileWatcherEventKind, NumericLiteral, collapseTextChangeRangesAcrossMultipleVersions } from "typescript"

class FiltersCompanion {
    static async getQuery(rowId: number, columnsToUpdate: Pick<UserFilters, "byCities" | "byRentPriceMax" | "byRentPriceMin" | "enable">): Promise<DbParams.updateParams> {

        switch(columnsToUpdate.enable){
            case false: return {table: "UserFilters", id: rowId, columns: ["enable"], values: [false]} ;
            case true: return {table: "UserFilters", id: rowId, columns: ["byCities", "byRentPriceMin", "byRentPriceMax", "enable"], values: [columnsToUpdate.byCities, columnsToUpdate.byRentPriceMin, columnsToUpdate.byRentPriceMax, true]} 
        }

    }

}

export class Filters {
    className: string = "Filters"

    private userFilters: UserFilters
    private res: Response

    constructor(data: UserFilters & middlewareTypes.JwtPayload, res: Response){
        this.userFilters = data
        this.res = res
    }
    
    async setFilters(){
        const db: Db = new Db()

        console.log(`body recieved: ${JSON.stringify(this.userFilters)} `)

        const byCities: string = (!this.userFilters.byCities || eva.isEmpty(this.userFilters.byCities))? "not Defined" : this.userFilters.byCities;
        const byRentPriceMin: number = (!this.userFilters.byRentPriceMin || eva.isEmpty(this.userFilters.byRentPriceMin) || this.userFilters.byRentPriceMin < 0)? 0.0 : this.userFilters.byRentPriceMin;
        const byRentPriceMax: number = (!this.userFilters.byRentPriceMax || eva.isEmpty(this.userFilters.byRentPriceMax) || this.userFilters.byRentPriceMax < 0)? 0.0 : this.userFilters.byRentPriceMax;

        try{
            const filterExists: UserFilters[] = await db.selectAll<UserFilters>("UserFilters", `userId = ${this.userFilters.userId}`)

            if(filterExists.length > 0 && filterExists[0].id){
                // update
                console.log(`Filters are going to be updated for User with id: ${filterExists[0].userId} ...`)
                console.log(`Enable value: ${this.userFilters.enable}`)

                await db
                    .update(
                        await FiltersCompanion.getQuery(
                            filterExists[0].id, 
                            {
                                byCities: byCities, 
                                byRentPriceMin: byRentPriceMin, 
                                byRentPriceMax: byRentPriceMax, 
                                enable: this.userFilters.enable
                            }
                    ))
                this.res.status(200).json({msg: "Row updated!"})

            }else{
                // create new record
                console.log(`User filters doenst exist, creating new entry ...`)
                const newRow: UserFilters = {
                    userId: this.userFilters.userId,
                    byCities: byCities,
                    byRentPriceMin: byRentPriceMin,
                    byRentPriceMax: byRentPriceMax,
                    enable: true
                }
                
                await db.insert<UserFilters>(newRow, "UserFilters")
                this.res.status(200).json({msg: "New row created!"})

            }

        }catch (e) {
            this.res.status(500).json({msg: e})
        }
    }

    async getFilters(){
        const db: Db = new Db()

        try{
            console.log(this.userFilters)
            const userFilters: UserFilters[] = await db.selectAll<UserFilters>("UserFilters", `userId = ${this.userFilters.userId}`)
            
            if(userFilters.length > 1) this.res.status(500).json({msg: "More than one record is not allowed!"});
            else this.res.status(200).json({filters: userFilters[0]});

        }catch(e){
            console.log(e)
            this.res.status(500).json({msg: e})
        }
    }

}