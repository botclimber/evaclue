

export interface User {
    id: number,
    email: string,
    type: "superAdmin" | "admin" | "col"
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
    html: string
}

export type CROPlusUser = ContactResOwner & User