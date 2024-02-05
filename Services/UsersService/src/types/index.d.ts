import { IUser } from "../models/User";

export {};

declare global {
  namespace Express {
      interface Request{
          user: IUser
      }
  }
  
  type GoogleUserType = {
    sub: string,
    name: string,
    given_name: string,
    family_name: string,
    picture: string, // we can give the user the option of using google picture in future | for now i would like to avoid it because brings more complexcity
    email: string,
    email_verified: boolean,
    locale: string
  }
}