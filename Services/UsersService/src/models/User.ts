import { RowDataPacket } from "mysql2"

// declare module 'express-session' {
//   export interface SessionData {
//     user: { [key: string]: any };
//     authorized: boolean
//   }
// }
export interface IUser extends RowDataPacket {
  id?: number
  email: string
  firstName: string
  lastName: string
  image: string
  password?: string
  created_at: Date
  blocked: boolean
  authType: string
  verified: boolean
  type: string
}

