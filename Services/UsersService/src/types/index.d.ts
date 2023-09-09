import { IUser } from "../models/User";

export {};

declare global {
  namespace Express {
      interface Request{
          user: IUser
      }
  }
}