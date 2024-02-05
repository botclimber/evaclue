import { NextFunction, Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import { ErrorMessages } from "../helpers/Constants";
import { BadRequest, Forbidden, Unauthorized } from "../helpers/ErrorTypes";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { EmailService } from "../services/EmailService";
import { UserRepository } from "../database/UserRepository";
import { IUser } from "../models/User";
import { EmailVerificationTokensRepository } from "../database/EmailVerificationTokensRepository";
import { UserSessionTokensRepository } from "../database/UserSessionTokensRepository";
import { IUserSessionTokens } from "../models/UserSessionTokens";
import {
  generateAcessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwtUtilities";

export default class UserService {

  static async GoogleUserAuth(userInfo: GoogleUserType): Promise<{accessToken: string, userId: number}> {

    const token = (user: IUser): string => generateAcessToken(user); 

    const user = {
      email: userInfo.email,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      image: "default.gif",
      created_at: new Date(),
      blocked: false,
      verified: userInfo.email_verified,
      type: "common"
    } as IUser // TODO: change user type on source

    console.log(`Checking if user exists for email: ${userInfo.email}`)
    const userExists = await UserRepository.FindOneByEmail(userInfo.email);
    if (!userExists){
      console.log(`User ${user.email} doesnt exist, creating new record on database ...`)
      const newUser = await UserRepository.Create(user)
      user.userId = newUser.id

      return {accessToken: token(user), userId: user.userId}
    }
    
    console.log(`User ${user.email} already registed! returning new generated token ...`)
    user.userId = userExists.id
    return {accessToken: token(user), userId: user.userId}
  }

  static async Register(user: IUser, type: string) {
    user.type = type;
    console.log(`Registration Request for email: ${user.email}`);

    const userExists = await UserRepository.FindOneByEmail(user.email);
    if (userExists) throw new BadRequest(ErrorMessages.USER_ALREADY_EXISTS);

    const hashedPassword = await bcrypt.hash(user.password as string, 10);
    user.password = hashedPassword;

    user = await UserRepository.Create(user);

    EmailService.SendVerifyEmail(user);
    console.log(`Sending verification email to: ${user.email}`);
  }

  static async RegisterAdmin(user: IUser, token: string) {
    console.log(`Registration Request for email: ${user.email}`);

    const userExists = await UserRepository.FindOneByEmail(user.email);
    if (userExists) throw new BadRequest(ErrorMessages.USER_ALREADY_EXISTS);

    try {
      const decToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload
      const admin: IUser | undefined = await UserRepository.FindOneById(decToken.userId)

      if (admin) {
        if ((admin.type == "admin" || admin.type == "superAdmin") && !admin.blocked) {
          const hashedPassword = await bcrypt.hash(user.password as string, 10);

          user.image = "default.gif";
          user.password = hashedPassword;
          user.verified = true;

          await UserRepository.Create(user);
        }
        else throw new Unauthorized(ErrorMessages.ADMIN_NOT_FOUND)

      }

    } catch (e) {
      console.log(e)
      throw new BadRequest(ErrorMessages.INVALID_TOKEN)
    }

    user = await UserRepository.Create(user);

    EmailService.SendVerifyEmail(user);
    console.log(`Sending verification email to: ${user.email}`);
  }

  static async GetUserData(userId: number): Promise<IUser> {
    // depending on whos getting the data remove and hide some fields

    try {
      console.log(`Decrypting token`)
      const user: IUser | undefined = await UserRepository.FindOneById(userId)

      console.log(`Checking if user ${user} exists and returning it as response`)
      if (user) {

        delete user.password;
        return user;

      } else throw new Unauthorized(ErrorMessages.USER_DOES_NOT_EXIST)

    } catch (e) {
      console.log(e)
      throw new BadRequest(ErrorMessages.INVALID_TOKEN)
    }
  }

  static async Login(user: IUser) {
    console.log(`Login Request for email: ${user.email}`);

    const userFound = await UserRepository.FindOneByEmail(user.email);

    if (!userFound) {
      console.log("INVALID EMAIL");
      throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    const verifyPassword = await bcrypt.compare(
      user.password as string,
      userFound.password as string
    );

    if (!verifyPassword) {
      console.log("WRONG PASSWORD");
      throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    delete userFound.password;

    console.log(`Login Successful for email: ${userFound.email} `);

    user.id = userFound.id

    const acessToken = generateAcessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { acessToken, refreshToken, userId: user.id};
  }

  static async RefreshToken(refreshToken: string) {
    if (refreshToken == null)
      throw new Forbidden(ErrorMessages.INVALID_TOKEN);

    let user = verifyToken(refreshToken) as IUser;

    if (!user) {
      throw new Unauthorized(ErrorMessages.USER_DOES_NOT_EXIST);
    }

    user = (await UserRepository.FindOneByEmail(user.email)) as IUser;

    delete user.password;
    const accessToken = generateAcessToken(user);

    return accessToken;
  }

  static async VerifyUser(userId: string, token: string) {
    console.log(`verifyUser Request for userId: ${userId}`);

    const user = await UserRepository.FindOneById(+userId);

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string); // if token wrong then triggers the catch exception

      const emailVerificationToken =
        await EmailVerificationTokensRepository.FindLast();

      // Should only verify last token since user can click multiple times to resend email
      if (
        !emailVerificationToken ||
        emailVerificationToken.token != decodedToken
      ) {
        throw new BadRequest("Token does not exist");
      }

      console.log(decodedToken);
      user.verified = true;
      await UserRepository.Update(user);
      console.log(`User with ID ${userId} verified`);

      // After verification, remove all email verification tokens generated for that user
      await EmailVerificationTokensRepository.Remove(+userId);

      return decodedToken;
    } catch (e) {
      console.log("Exception: " + e);
      throw new BadRequest(ErrorMessages.INVALID_TOKEN);
    }
  }

  static async ParseToken(token: string): Promise<jwt.JwtPayload> {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  }

  static async ChangePasswordWithToken(token: string, password: any) {
    const { userId } = await UserService.ParseToken(token);

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

  static async ChangePassword(
    userId: string,
    oldPassword: string,
    password: string
  ) {
    console.log(`updateUserPassword Request for userId: ${userId}`);

    // Check if this is needed (dont let user see if email exists or not)
    const user = await UserRepository.FindOneById(+userId);

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    const verifyPassword = await bcrypt.compare(
      user.password as string,
      oldPassword
    );

    if (!verifyPassword) {
      console.log("WRONG PASSWORD");
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
