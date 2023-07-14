"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const Database_1 = require("./Database");
class UserRepository {
    static async ReadAll() {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("SELECT * FROM users", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    static async FindOneById(user_id) {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("SELECT * FROM users WHERE id = ?", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    static async FindOneByEmail(email) {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    static async Create(user) {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("INSERT INTO users (email, username, firstName, lastName, password , type) VALUES(?,?,?,?,?,?)", [user.email, user.username, user.firstName, user.lastName, user.password, user.type], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.FindOneById(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    static async Update(user) {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("UPDATE users SET email = ?, password = ?, verified = ?, WHERE id = ?", [user.email, user.password, user.verified, user.id], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.FindOneById(user.id)
                        .then(resolve)
                        .catch(reject);
            });
        });
    }
    static async Remove(user_id) {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("DELETE FROM users WHERE id = ?", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
}
exports.UserRepository = UserRepository;
