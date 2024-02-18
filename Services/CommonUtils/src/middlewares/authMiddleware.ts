import { NextFunction, Request, Response } from "express";
import { errorMessages as err} from "../helpers/errorMessages";
import jwt from "jsonwebtoken";

function decryptToken(token: string): middlewareTypes.JwtPayload {
  return jwt.verify(token, process.env.SECRET ?? "") as middlewareTypes.JwtPayload
}

// TODO: handle expired token
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  try{
    const { authorization } = req.headers;

  if (!authorization) {
    res.status(err.TOKEN_REQUIRED.status).json({msg: err.TOKEN_REQUIRED.text})
    throw Error(err.TOKEN_REQUIRED.text);
  }

  const token = authorization.split(" ")[1];
  console.log(`string to be decrypted: ${token}`)

  const decryptedToken  = decryptToken(token)
  console.log("decrypted token: ")
  console.log(decryptedToken)

  // TODO:
  // - check if user exists 
  // - check if token has expired

  const userExists = await 
  /*
  const user = await userRepository.findOneById(userId);

  if (!user) {
    res.status(err.USER_NOT_AUTHORIZED.status).json({msg: err.USER_NOT_AUTHORIZED.text})
    throw Error(err.USER_NOT_AUTHORIZED.text);
  }

  const loggedUser = user;

  req.user = loggedUser;
 */

  req.body = {...req.body, ...decryptedToken}
  next();

  }catch(e){
    console.log(e)

  }
};
