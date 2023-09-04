import {genTestToken, genEmailToken, ofType} from "../../src/logic/types/typeModels"
import jwt from "jsonwebtoken"

const SECRET = process.env.SECRET ?? ""

export const testToken: genTestToken = (id: number, type: ofType, email?: string): string => {
    const toBeSigned = (email)? {id: id, email: email, type: type} : {id: id, type: type}
    return jwt.sign(toBeSigned, SECRET)
 }

export const testEmailToken: genEmailToken = (email: string): string => {
    return jwt.sign(email, SECRET)
}