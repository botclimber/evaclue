import { RowDataPacket } from "mysql2"

export interface IUser extends RowDataPacket {
  id?: number
  email: string
  username: string
  firstName: string
  lastName: string
  image: string
  password: string
  created_at: Date
  blocked: boolean
  verified: boolean
  type: string
}