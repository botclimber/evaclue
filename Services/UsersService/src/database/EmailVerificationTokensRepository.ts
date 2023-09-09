import mysql, { OkPacket } from "mysql2"
import { Database } from "./Database";
import { IEmailVerificationTokens } from "../models/EmailVerificationTokens"



export class EmailVerificationTokensRepository {
    static async ReadAll(): Promise<IEmailVerificationTokens[]> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IEmailVerificationTokens[]>("SELECT * FROM emailVerificationTokens", (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    }

    static async FindOneByToken(token: string): Promise<IEmailVerificationTokens | undefined> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IEmailVerificationTokens[]>(
                "SELECT * FROM emailVerificationTokens WHERE token = ?",
                [token],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                }
            )
        })
    }

    static async FindLast(): Promise<IEmailVerificationTokens | undefined> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IEmailVerificationTokens[]>(
                "SELECT * FROM emailVerificationTokens ORDER BY ID DESC LIMIT 1",
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                }
            )
        })
    }

    static async FindOneByUserId(user_id: number): Promise<IEmailVerificationTokens | undefined> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IEmailVerificationTokens[]>(
                "SELECT * FROM emailVerificationTokens WHERE id = ?",
                [user_id],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                }
            )
        })
    }

    static async Create(emailVerificationToken: IEmailVerificationTokens): Promise<IEmailVerificationTokens> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<OkPacket>(
                "INSERT INTO emailVerificationTokens (userId, token) VALUES(?,?)",
                [emailVerificationToken.userId, emailVerificationToken.token],
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

    // static async Update(user: IEmailVerificationTokens): Promise<IEmailVerificationTokens | undefined> {
    //     return new Promise((resolve, reject) => {
    //         const connection = mysql.createConnection(Database.Access);
    //         connection.query<OkPacket>(
    //             "UPDATE emailVerificationTokens SET email = ?, password = ?, verified = ? WHERE id = ?",
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
                "DELETE FROM emailVerificationTokens WHERE id = ?",
                [user_id],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res.affectedRows)
                }
            )
        })
    }
}