import { User } from "../../database/src/entities/Users";

declare global {
  namespace Express {
    export interface Request {
      user: Partial<User>;
    }
  }
}
