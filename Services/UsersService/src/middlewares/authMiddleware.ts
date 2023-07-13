import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../helpers/Constants";
import { Unauthorized } from "../helpers/ErrorTypes";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { UserRepository } from "../database/UserRepository";

type JwtPayload = {
  userId: number,
  userEmail: string,
  userType: string
};

function deToken(token: string): JwtPayload { return jwt.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo") as JwtPayload }

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log(req)

  const { authorization } = req.headers;

  if (!authorization) {
    throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  }

  const token = authorization.split(" ")[1];

  const { userId, userEmail, userType } = deToken(token)
  const user = await UserRepository.FindOneById(userId);

  if (!user) {
    throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  }

  const { password: _, ...loggedUser } = user;

  //req.user = loggedUser;

  next();
};
