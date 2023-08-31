import { NextFunction, Request, Response } from "express";
import { errorMessages as err} from "../helpers/errorMessages";
import jwt from "jsonwebtoken";

function deToken(token: string): middlewareTypes.JwtPayload { return jwt.verify(token, process.env.SECRET ?? "") as middlewareTypes.JwtPayload}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.log(req)

  const { authorization } = req.headers;

  if (!authorization) {
    res.status(err.TOKEN_REQUIRED.status).json({msg: err.TOKEN_REQUIRED.text})
    throw Error(err.TOKEN_REQUIRED.text);
  }

  const token = authorization.split(" ")[1];

  const {userId, userEmail, userType} = deToken(token)
  
  // TODO: replace following lines | check if user exists
  /*
  const user = await userRepository.findOneById(userId);

  if (!user) {
    res.status(err.USER_NOT_AUTHORIZED.status).json({msg: err.USER_NOT_AUTHORIZED.text})
    throw Error(err.USER_NOT_AUTHORIZED.text);
  }

  const loggedUser = user;

  req.user = loggedUser;
 */

  next();
};
