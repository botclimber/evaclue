export type ofType = "superAdmin" | "admin" | "col"
export type genTestToken = (id: number, type: ofType, email?: string) => string
export type genEmailToken = (emai: string) => string

export interface User {
    id: number,
    email: string,
    type: ofType
}

export type Users = User & {
    username: string,
    firstName: string,
    lastName: string,
    image: string,
    password: string,
    blocked: boolean,
    verified: boolean
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
    from: string,
    subject: string,
    html: string,
}

export type CROPlusUser = ContactResOwner & User

export interface AvailableRents {
    toEmail: string,
    available: [{
        userId: number,
        city: string,
        flat: string,
        floor: string,
        rentPrice: number,
        lat: number,
        lng: number
    }]
}