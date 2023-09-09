import mysql, { OkPacket } from "mysql2"
import { Database } from "./Database";
import { IUserSessionTokens } from "../models/UserSessionTokens"

export class UserSessionTokensRepository {
    static async ReadAll(): Promise<IUserSessionTokens[]> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IUserSessionTokens[]>("SELECT * FROM userSessionTokens", (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    }

    static async FindOneByToken(token: string): Promise<IUserSessionTokens | undefined> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IUserSessionTokens[]>(
                "SELECT * FROM userSessionTokens WHERE token = ?",
                [token],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                }
            )
        })
    }

    static async FindOneByUserId(user_id: number): Promise<IUserSessionTokens | undefined> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IUserSessionTokens[]>(
                "SELECT * FROM userSessionTokens WHERE id = ?",
                [user_id],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                }
            )
        })
    }

    static async Create(userSessionTokens: IUserSessionTokens): Promise<IUserSessionTokens> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<OkPacket>(
                "INSERT INTO userSessionTokens (userId, token) VALUES(?,?)",
                [userSessionTokens.userId, userSessionTokens.token],
                (err, res) => {
                    if (err) reject(err)
                    else
                        this.FindOneByUserId(res.insertId)
                            .then(user => resolve(user!))
                            .catch(reject)
                }
            )
        })
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

    static async Remove(user_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<OkPacket>(
                "DELETE FROM userSessionTokens WHERE id = ?",
                [user_id],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res.affectedRows)
                }
            )
        })
    }
}