"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionTokensRepository = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const Database_1 = require("./Database");
class UserSessionTokensRepository {
    static async ReadAll() {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("SELECT * FROM userSessionTokens", (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res);
            });
        });
    }
    static async FindOneByToken(token) {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("SELECT * FROM userSessionTokens WHERE token = ?", [token], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    static async FindOneByUserId(user_id) {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("SELECT * FROM userSessionTokens WHERE id = ?", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res === null || res === void 0 ? void 0 : res[0]);
            });
        });
    }
    static async Create(userSessionTokens) {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("INSERT INTO userSessionTokens (userId, token) VALUES(?,?)", [userSessionTokens.userId, userSessionTokens.token], (err, res) => {
                if (err)
                    reject(err);
                else
                    this.FindOneByUserId(res.insertId)
                        .then(user => resolve(user))
                        .catch(reject);
            });
        });
    }
    // static async Update(user: IUserSessionTokens): Promise<IUserSessionTokens | undefined> {
    //     return new Promise((resolve, reject) => {
    //         const connection = mysql.createConnection(Database.Access);
    //         connection.query<OkPacket>(
    //             "UPDATE userSessionTokens SET email = ?, password = ?, verified = ? WHERE id = ?",
    //             [user.email, user.password, user.verified, user.id],
    //             (err, res) => {
    //                 if (err) reject(err)
    //                 else
    //                     this.FindOneById(user.id!)
    //                         .then(resolve)
    //                         .catch(reject)
    //             }
    //         )
    //     })
    // }
    static async Remove(user_id) {
        return new Promise((resolve, reject) => {
            const connection = mysql2_1.default.createConnection(Database_1.Database.Access);
            connection.query("DELETE FROM userSessionTokens WHERE id = ?", [user_id], (err, res) => {
                if (err)
                    reject(err);
                else
                    resolve(res.affectedRows);
            });
        });
    }
}
exports.UserSessionTokensRepository = UserSessionTokensRepository;
