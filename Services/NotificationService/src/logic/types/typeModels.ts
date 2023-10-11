export type ofType = "superAdmin" | "admin" | "col"
export type genTestToken = (id: number, type: ofType, email?: string) => string
export type genEmailToken = (emai: string) => string

// TODO: move to the CommonUtils types that can be Models 

export type UserFilters = {
    id?: number,
    userId: number,
    byCities: string,
    byRentPriceMax: number,
    byRentPriceMin: number,
    enable: boolean
}

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

export interface ToContact {
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

export type CROPlusUser = ToContact & User

export interface available {    
    resOwnerId: number,
    city: string,
    street: string,
    nr: number,
    flat: string,
    floor: string,
    rentPrice: number,
    lat: number,
    lng: number
}

export interface AvailableRents {
    toEmail: string,
    available: Array<available>
}

export type emBody = {
    resOwnerId: number,
    userId: number,
    message: string
}

export type userData = {fullName: string, email: string}