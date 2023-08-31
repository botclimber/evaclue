import { NextFunction, Request, Response } from "express";
import { userRepository } from "../../database/src/repositories/userRepository";
import { ErrorMessages } from "../helpers/constants";
import { Unauthorized } from "../helpers/errorTypes";
import jwt from "jsonwebtoken";
import "dotenv/config";

type JwtPayload = {
  userId: number,
  userEmail: string,
  userType: string
};

function deToken(token: string): JwtPayload { return jwt.verify(token, process.env.SECRET ?? "") as JwtPayload }

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

  const {userId, userEmail, userType} = deToken(token)
  const user = await userRepository.findOneById(userId);

  if (!user) {
    throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  }

  const { password: _, ...loggedUser } = user;

  req.user = loggedUser;

  next();
};
