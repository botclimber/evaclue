
export interface User {
    id: number,
    email: string,
    type: "superAdmin" | "admin" | "col"
}

export interface ContactResOwner {
    resOwnerId: number,
    userId: number,
    createdAt: string,
    message?: string
}

export type Sub = {
    id?: number,
    email: string,
    createdAt: string
}