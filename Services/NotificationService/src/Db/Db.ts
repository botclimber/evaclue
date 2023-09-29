import {createPool, Pool} from "mysql2";
import * as eva from "eva-functional-utils";

type updateParams = {
    table: string,
    id: number,
    columns: string[],
    values: any[]
}

type DbConfig = {
    host: string,
    user: string,
    password: string,
    database: string,
    connectionLimit?: number
}

export class Db {
    private sqlTypeSafer <A>(value: A): A {
        switch(typeof(value)){
            case "string": return '"'+value+'"' as A; break;
			default: return value
        }
    } 

    private _dbConfig: DbConfig = {
        host: process.env.DB_HOST || '',
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || '',
    }

    async openConnection(): Promise<Pool> {
        const connection = createPool(this._dbConfig);
        return connection;
    }

    async selectAll<T>(table: string, conditions: string | undefined = undefined): Promise<Required<T>[]>  {
        const con = await this.openConnection()

        try{
            const cond = (eva.isEmpty(conditions))? ""  : ` WHERE ${conditions}`
            const sql = `SELECT * FROM ${table}${cond}`

            const res: any = await con.promise().execute(sql)
            return res[0]

        }catch (e){
            console.log(e)
            throw e
        }finally{
            con.end(() => {/* close connection */})
        }
    }

    async insert<T extends {}>(object: T, tableName?: string): Promise<number> { 
        const con = await this.openConnection()

        try
        {
            const columnNames: string = Object.keys(object).join(',')
            const values: string = Object.values(object).map(_ => this.sqlTypeSafer(_)).join(',')

            const table = (eva.isEmpty(tableName))? object.constructor.name : tableName
            const sql: string = `INSERT INTO ${table} (${columnNames}) VALUES (${values})`;

            console.log("[SQL - INSERT]: "+sql)
            const res = await con.promise().execute(sql);
            return res[0].insertId

        }catch(e){
            console.log(e)
            throw e
        }finally{
            con.end(() => {/** close connection */})
        }
    }

    // update
    async update(params: updateParams): Promise<void> {
        const con = await this.openConnection();
        
        try{
            const toBeUpdated: string = params.columns.map( (value, key) =>  value+'='+this.sqlTypeSafer(params.values[key])).join();
            const sql: string = `UPDATE ${params.table} SET ${toBeUpdated} WHERE id = ${params.id}`;

            const res = await con.promise().execute(sql);
            console.log("i guess it worked!")
            console.log(res)

        }catch(e){
            console.log(e)
            throw e
        }finally{
            con.end(() => {/** close connection */})
        }
    }

    //TODO: maybe we should create an exists method for performance reasons
    // delete
}