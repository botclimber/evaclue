
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
    userName: string,
    createdAt?: string,
    message?: string
}

export type Sub = {
    id?: number,
    email: string,
    createdAt: string
}

export type CROPlusUser = ContactResOwner & User