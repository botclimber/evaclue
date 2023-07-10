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
        // insert
        // update
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
    // selectAll
    //TODO: teste result and add proper generic type
    async selectAll(table) {
        const con = await this.openConnection();
        try {
            const sql = `SELECT * FROM ${table}`;
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
    async insert(object, table) {
        const con = await this.openConnection();
        try {
            // TODO: name of object not being detected
            const columnNames = Object.keys(object).join(',');
            const values = Object.values(object).map(_ => this.sqlTypeSafer(_)).join(',');
            const sql = `INSERT INTO ${table} (${columnNames}) VALUES (${values})`;
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
    // selectOne
    // maybe some rework in order to make this even more generic
    // for now it search relying only on one field/column
    async selectOne(object, table) {
        const con = await this.openConnection();
        try {
            const sql = `SELECT * FROM ${table} WHERE ${Object.keys(object)[0]} = ${this.sqlTypeSafer(Object.values(object)[0])}`;
            console.log(sql);
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
}
exports.Db = Db;
