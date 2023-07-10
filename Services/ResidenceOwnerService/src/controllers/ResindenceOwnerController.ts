import { NextFunction, Response, Request } from "express";
import "dotenv/config";
import { error } from "console";
import "express-async-errors";
import mysql, { ConnectionOptions } from 'mysql2';
import { Database } from "../database/database";

export class ResidenceOwnerController {

    async GetAllClaimedResidence(req: Request, res: Response, next: NextFunction) {

        let columns = '*';
        let table = 'users'

        const conn = mysql.createConnection(Database.Access);

        conn.query(`SELECT ${columns} from ${table};`, (_err, rows) => {
            return res.status(201).json(rows);
        });
      
    }
}
