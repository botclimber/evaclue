import { NextFunction, Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import { ErrorMessages } from "../helpers/Constants";
import { BadRequest } from "../helpers/ErrorTypes";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { EmailService } from "../services/EmailService";
import { UserRepository } from "../database/UserRepository";
import { IUser } from "../models/User";
import { EmailVerificationTokensRepository } from "../database/EmailVerificationTokensRepository";
import { UserSessionTokensRepository } from "../database/UserSessionTokensRepository";
import { IUserSessionTokens } from "../models/UserSessionTokens";

export default class UserService {

  static async Register(user: IUser, type: string) {

    user.type = type;
    console.log(`Registration Request for email: ${user.email}`);

    const userExists = await UserRepository.FindOneByEmail(user.email);
    if (userExists) throw new BadRequest(ErrorMessages.USER_ALREADY_EXISTS);

    const hashedPassword = await bcrypt.hash(user.password as string, 10);
    user.password = hashedPassword

    user = await UserRepository.Create(user);

    EmailService.SendVerifyEmail(user);
    console.log(`Sending verification email to: ${user.email}`);
  }

  static async Login(user: IUser) {
    console.log(`Login Request for email: ${user.email}`);

    const userFound = await UserRepository.FindOneByEmail(user.email);

    if (!userFound) {
      console.log("INVALID EMAIL")
      throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    const verifyPassword = await bcrypt.compare(user.password as string, userFound.password as string);

    if (!verifyPassword) {
      console.log("WRONG PASSWORD")
      throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    delete userFound.password;


    // const accessToken = jwt.sign({ userFound }, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE4Mjk3NiwiaWF0IjoxNjg5MTgyOTc2fQ.GUGr_MNFADIZZUG8CPb0BIPArnz_Mw4W_Mzjz2bU-v4", {
    //   expiresIn: "5s",
    // });

    // const refreshToken = jwt.sign({ userId: userFound.id}, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE4Mjk3NiwiaWF0IjoxNjg5MTgyOTc2fQ.GUGr_MNFADIZZUG8CPb0BIPArnz_Mw4W_Mzjz2bU-v4", {
    //   expiresIn: "1y",
    // });

    // const userSessionToken = {token: accessToken, userId: userFound.id}

    // await UserSessionTokensRepository.Create(userSessionToken as IUserSessionTokens);

    console.log(`Login Successful for email: ${userFound.email} `);

    return userFound;
  }

  static async VerifyUser(userId: string, token: string) {

    console.log(`verifyUser Request for userId: ${userId}`);

    const user = await UserRepository.FindOneById(+userId);

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    try {
      const decodedToken = jwt.verify(token, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo"); // if token wrong then triggers the catch exception

      const emailVerificationToken = await EmailVerificationTokensRepository.FindLast();

      // Should only verify last token since user can click multiple times to resend email
      if (!emailVerificationToken || emailVerificationToken.token != decodedToken) {
        throw new BadRequest("Token does not exist");
      }

      console.log(decodedToken)
      user.verified = true;
      await UserRepository.Update(user);
      console.log(`User with ID ${userId} verified`);

      // After verification, remove all email verification tokens generated for that user
      await EmailVerificationTokensRepository.Remove(+userId);

      return decodedToken;

    } catch (e) {
      console.log("Exception: " + e)
      throw new BadRequest(ErrorMessages.INVALID_TOKEN)
    }
  }

  static async ParseToken(token: string): Promise<jwt.JwtPayload> {
    return jwt.verify(token,
      "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo") as JwtPayload
  }

  static async ChangePasswordWithToken(token: string, password: any) {

    const { userId } = await UserService.ParseToken(token)

    console.log(`updateUserPassword Request for userId: ${userId}`);

    const user = await UserRepository.FindOneById(+userId);

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    console.log("Sucessfully updated password");

    await UserRepository.Update(user);

  }

  static async ChangePassword(userId: string, oldPassword: string, password: string) {
    console.log(`updateUserPassword Request for userId: ${userId}`);

    // Check if this is needed (dont let user see if email exists or not)
    const user = await UserRepository.FindOneById(+userId);

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    const verifyPassword = await bcrypt.compare(user.password as string, oldPassword);

    if (!verifyPassword) {
      console.log("WRONG PASSWORD")
      throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    console.log("Sucessfully updated password");

    await UserRepository.Update(user);
  }

  static async RecoverUserPasswordEmailRequest(email: string) {
    console.log(`changePasswordRequest Request for email: ${email}`);

    const user = await UserRepository.FindOneByEmail(email);

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    EmailService.SendChangePasswordEmail(user);
    console.log(`Send password reset email to: ${email}`);

    return user;
  }


  // static async Register() {

  //   const { firstName, lastName, password, email, username, type } = req.body;
  //   const specFields = [firstName, lastName, password, email, username, type]

  //   specFields.forEach(field => { if (field === "") { throw new BadRequest(ErrorMessages.ALL_REQUIRED) } })

  //   console.log(`Registration Request for email: ${email}`);

  //   const userExists = await userRepository.findOneBy({ email });
  //   if (userExists) throw new BadRequest(ErrorMessages.USER_ALREADY_EXISTS);

  //   const token: string = (req.headers['r-access-token'] ?? "") as string
  //   if (!token) throw new BadRequest(ErrorMessages.TOKEN_REQUIRED)

  //   try {
  //     const decToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload
  //     const admin: any = await userRepository.findOneBy({ id: decToken.userId })

  //     if ((admin.type == "admin" || admin.type == "superAdmin") && !admin.blocked) {
  //       const hashedPassword = await bcrypt.hash(password, 10);

  //       const newUser = userRepository.create({
  //         image: "default.gif",
  //         firstName,
  //         lastName,
  //         password: hashedPassword,
  //         email,
  //         username,
  //         type
  //       });

  //       await userRepository.save(newUser);
  //       console.log(`Registration Successful for email: ${email}`);

  //       EmailHelper.sendVerifyEmail(newUser);
  //       console.log(`Sending verification email to: ${email}`);

  //       const { password: _, ...user } = newUser;

  //       return res.status(201).json(user);

  //     } else throw new Unauthorized(ErrorMessages.ADMIN_NOT_FOUND)

  //   } catch (e) {
  //     console.log(e)
  //     throw new BadRequest(ErrorMessages.INVALID_TOKEN)
  //   }
  // }
}

