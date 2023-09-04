"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = void 0;
const mysql2_1 = require("mysql2");
const eva = __importStar(require("eva-functional-utils"));
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
            const cond = (eva.isEmpty(conditions)) ? "" : ` WHERE ${conditions}`;
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
    async insert(object, tableName) {
        const con = await this.openConnection();
        try {
            const columnNames = Object.keys(object).join(',');
            const values = Object.values(object).map(_ => this.sqlTypeSafer(_)).join(',');
            const table = (eva.isEmpty(tableName)) ? object.constructor.name : tableName;
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
