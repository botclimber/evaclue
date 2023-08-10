"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = void 0;
const mysql2_1 = require("mysql2");
class Db {
    constructor() {
        this._dbConfig = {
            host: process.env.DB_HOST || '',
            user: process.env.DB_USER || '',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || '',
        };
        //TODO: maybe we should create an exists method for performance reasons
        // delete
    }
    sqlTypeSafer(value) {
        switch (typeof (value)) {
            case "string":
                return '"' + value + '"';
                break;
            default: return value;
        }
    }
    async openConnection() {
        const connection = (0, mysql2_1.createPool)(this._dbConfig);
        return connection;
    }
    async selectAll(table, conditions = undefined) {
        const con = await this.openConnection();
        try {
            const cond = (conditions) ? ` WHERE ${conditions}` : "";
            const sql = `SELECT * FROM ${table}${cond}`;
            const res = await con.promise().execute(sql);
            return res[0];
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        finally {
            con.end(() => { });
        }
    }
    async insert(object) {
        const con = await this.openConnection();
        try {
            const columnNames = Object.keys(object).join(',');
            const values = Object.values(object).map(_ => this.sqlTypeSafer(_)).join(',');
            const sql = `INSERT INTO ${object.constructor.name} (${columnNames}) VALUES (${values})`;
            console.log("[SQL - INSERT]: " + sql);
            const res = await con.promise().execute(sql);
            return res[0].insertId;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        finally {
            con.end(() => { });
        }
    }
    // update
    async update(params) {
        const con = await this.openConnection();
        try {
            const toBeUpdated = params.columns.map((value, key) => value + '=' + this.sqlTypeSafer(params.values[key])).join();
            const sql = `UPDATE ${params.table} SET ${toBeUpdated} WHERE id = ${params.id}`;
            const res = await con.promise().execute(sql);
            console.log("i guess it worked!");
            console.log(res);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
        finally {
            con.end(() => { });
        }
    }
}
exports.Db = Db;
