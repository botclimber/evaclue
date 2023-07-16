import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../helpers/Constants";
import { BadRequest, Forbidden, Unauthorized } from "../helpers/ErrorTypes";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { UserRepository } from "../database/UserRepository";
import { UserSessionTokensRepository } from "../database/UserSessionTokensRepository";
import { IUserSessionTokens } from "../models/UserSessionTokens";
import { IUser } from "../models/User";

type JwtPayload = {
  userId: number,
  userEmail: string,
  userType: string
};

// function deToken(token: string): JwtPayload {
//   try {
//     const user = jwt.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo") as JwtPayload
//   } catch {

//   }
// }

// verify jwt
function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo");
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: "expired" };
  }
}

function signJWT(payload: object, expiresIn: string | number) {
  return jwt.sign(payload, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo", { algorithm: "RS256", expiresIn });
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log(req.session.user);
  console.log(req.session.authorized);
  if (req.session.authorized){
    next();
  }else{
    throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  }
};
