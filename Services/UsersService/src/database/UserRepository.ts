import mysql, { OkPacket } from "mysql2"
import { IUser } from "../models/User"
import { Database } from "./Database";

export class UserRepository {
    static async ReadAll(): Promise<IUser[]> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IUser[]>("SELECT * FROM users", (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    }

    static async FindOneById(user_id: number): Promise<IUser | undefined> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IUser[]>(
                "SELECT * FROM users WHERE id = ?",
                [user_id],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                }
            )
        })
    }

    static async FindOneByEmail(email: string): Promise<IUser | undefined> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<IUser[]>(
                "SELECT * FROM users WHERE email = ?",
                [email],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                }
            )
        })
    }

    static async  Create(user: IUser): Promise<IUser> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<OkPacket>(
                "INSERT INTO users (email, firstName, image, lastName, password , type, blocked, authType, verified, createdAt, createdBy, modifiedOn, modifiedBy) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [user.email, user.firstName, user.image, user.lastName, user.password, user.type, user.blocked, user.authType, user.verified, user.created_at, 0, "1000-01-01 00:00:00", 0],
                (err, res) => {
                    if (err) reject(err)
                    else
                        this.FindOneById(res.insertId)
                            .then(user => resolve(user!))
                            .catch(reject)
                }
            )
        })
    }

    static async Update(user: IUser): Promise<IUser | undefined> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<OkPacket>(
                "UPDATE users SET email = ?, password = ?, verified = ? WHERE id = ?",
                [user.email, user.password, user.verified, user.id],
                (err, res) => {
                    if (err) reject(err)
                    else
                        this.FindOneById(user.id!)
                            .then(resolve)
                            .catch(reject)
                }
            )
        })
    }

    static async Remove(user_id: number): Promise<number> {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(Database.Access);
            connection.query<OkPacket>(
                "DELETE FROM users WHERE id = ?",
                [user_id],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res.affectedRows)
                }
            )
        })
    }
}