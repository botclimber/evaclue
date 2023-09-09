import { RowDataPacket } from "mysql2"

export interface IEmailVerificationTokens extends RowDataPacket {
    id?: number,
    userId?: number
    token?: string,
    createdAt?: Date,
    createdBy?: string,
    modifiedOn?: Date,
    modifiedBy?: string,
}