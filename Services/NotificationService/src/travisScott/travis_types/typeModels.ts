export type ofType = "superAdmin" | "admin" | "col"
export type genTestToken = (id: number, type: ofType, email?: string) => string
export type genEmailToken = (emai: string) => string

export interface User {
    id: number,
    email: string,
    type: ofType
}

export interface ContactResOwner {
    cId?: number,
    resOwnerId: number,
    userId: number,
    resOwnerEmail: string,
    userEmail: string,
    userName: string,
    createdAt?: string,
    message?: string
}

export type Sub = {
    id?: number,
    email: string,
    createdAt: string
}

export interface EmailForm {
    to: string,
    cc?: string,
    envelope?: {from: string, to: string},
    from?: string,
    subject: string,
    html?: string,
    text?: string
}

export type CROPlusUser = ContactResOwner & User