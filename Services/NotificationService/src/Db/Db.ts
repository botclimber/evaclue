import {createPool, Pool, Query} from "mysql2";
import dotenv from "dotenv";
dotenv.config();

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

    // selectAll
    //TODO: teste result and add proper generic type
    async selectAll<T>(table: string): Promise<T[]>  {
        const con = await this.openConnection()

        try{
            
            const sql = `SELECT * FROM ${table}`
            const res: any = await con.promise().execute(sql)
            return res[0]

        }catch (e){
            console.log(e)
            throw e
        }finally{
            con.end(() => {/* close connection */})
        }
    }

    async insert(object: Object, table: string): Promise<number> { 
        const con = await this.openConnection()

        try
        {
            // TODO: name of object not being detected
            const columnNames: string = Object.keys(object).join(',')
            const values: string = Object.values(object).map(_ => this.sqlTypeSafer(_)).join(',')

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

    // selectOne
    // maybe some rework in order to make this even more generic
    // for now it search relying only on one field/column
    async selectOne<A>(object: Partial<A>, table: string): Promise<A[]> {
        const con = await this.openConnection()

        try{
            
            const sql = `SELECT * FROM ${table} WHERE ${Object.keys(object)[0]} = ${this.sqlTypeSafer(Object.values(object)[0])}`
            console.log(sql)
            const res: any = await con.promise().execute(sql)
            return res[0]

        }catch (e){
            console.log(e)
            throw e
        }finally{
            con.end(() => {/* close connection */})
        }
    }

    // insert

    // update

    // delete
}