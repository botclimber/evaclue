import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../helpers/Constants";
import { BadRequest, Forbidden, Unauthorized } from "../helpers/ErrorTypes";
import "dotenv/config";
import { IUser } from "../models/User";
import { generateAcessToken, verifyToken } from "../utils/jwtUtilities";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
  const authHeader = req.headers['authorization']
  console.log('auth middle: ' + authHeader)
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);

  const user = verifyToken(token) as IUser;
  console.log(user)

  if (!user) {
    throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  }
  
  req.user = user
  next();

}catch (e){
  console.log(e)
  return res.status(500).json({msg: e})
}

  // const { accessToken, refreshToken } = req.cookies;

  // if (!accessToken) {
  //   throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  // }

  // let user = verifyToken(accessToken) as IUser;

  // if (user) {
  //   req.user = user;
  //   return next();
  // }

  // if (!refreshToken) {
  //   throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  // }

  // const userId = verifyToken(refreshToken) as string;

  // if (!userId) {
  //   throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  // }

  // //checkar se esta sessao está ativa na bd

  // user = await UserRepository.FindOneById(+userId) as IUser;

  // delete user.password;

  // const newAccessToken = generateAcessToken(user);
  // req.user = user;
  // res.cookie('accessToken', newAccessToken,{
  //   maxAge: 30000,
  //   httpOnly : true
  // })


  // try {
  //   const user = jwt.verify(accessToken, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo");
  //   req.user = user as IUser;
  //   next();
  // } catch (error) {
  //   throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  // }

  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader?.split(' ')[1];

  // if (token == null) {
  //   throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  // }

  // try {
  //   const user = jwt.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo");
  //   req.user = user as IUser;
  //   next();
  // } catch (error) {
  //   throw new Unauthorized(ErrorMessages.USER_NOT_AUTHORIZED);
  // }
};
