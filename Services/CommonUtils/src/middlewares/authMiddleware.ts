import { NextFunction, Request, Response } from "express";
import { errorMessages as err } from "../helpers/errorMessages";
import jwt from "jsonwebtoken";

async function decryptToken(encryptedToken: string): Promise<middlewareTypes.JwtPayload> {
  return jwt.verify(encryptedToken, process.env.SECRET ?? "") as middlewareTypes.JwtPayload
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      res.status(err.TOKEN_REQUIRED.status).json({ msg: err.TOKEN_REQUIRED.text })
      throw Error(err.TOKEN_REQUIRED.text);
    }

    const token = authorization.split(" ")[1];
    console.log(`string to be decrypted: ${token}`)

    const decryptedToken = await decryptToken(token)
    console.log("decrypted token: ")
    console.log(decryptedToken)

    console.log("Checking if token has expiration time defined in object ...")
    if (!decryptedToken.exp) return res.status(401).json({ msg: "(exp) key not defined and its mandatory." })

    req.body = { ...req.body, ...decryptedToken }
    next();

  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: e });
  }
};