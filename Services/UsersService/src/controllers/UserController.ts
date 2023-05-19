import { NextFunction, Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import dat from "date-and-time"
import { userRepository } from "../../database/src/repositories/userRepository";
import { ErrorMessages } from "../helpers/constants";
import { BadRequest, Unauthorized } from "../helpers/errorTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { EmailHelper } from "../helpers/emailHelper";
import { User } from "../../database/src/entities/Users";
import { error } from "console";

type JwtPayload = {
  userId: number,
  userEmail: string,
  userType: string
};

/**
 * @method _updateImgDB     update image name on Data Base
 * @method _generateImgCode generate some random name for uploaded file in order to not have naming conflicts
 */
abstract class UserControllerHelper{

  /**
   * 
   * @param finalFileName 
   * @param userId 
   */
  protected async _updateImgDB(finalFileName: string, userId: number): Promise<void>{
    const user = await userRepository.findOneBy({ id: +userId });
    
    if(user){
      user.image = finalFileName
      await userRepository.save(user);

    }else {
      throw new BadRequest("User does not exist");
    }
  }

  /**
   * 
   * @param fileName 
   * @returns 
   */
  protected async _generateImgCode(fileName: String): Promise<string>{ 
    const max = 1000
    const min = 1

    return fileName.replaceAll(".", "") + Math.floor(Math.random() * (max - min + 1) + min).toString() + ".gif"
  } 

}

export class UserController extends UserControllerHelper {
  
  constructor(){ super() }

  async registCommon(req: Request, res: Response, next: NextFunction) {

    const { firstName, lastName, password, email, username } = req.body;
    const type = "common"

    console.log(`Registration Request for email: ${email}`);

    const userExists = await userRepository.findOneBy({ email });
    if (userExists) throw new BadRequest(ErrorMessages.USER_ALREADY_EXISTS);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      image: "default.gif",
      firstName,
      lastName,
      password: hashedPassword,
      email,
      username,
      type
    });

    await userRepository.save(newUser);
    console.log(`Registration Successful for email: ${email}`);

    EmailHelper.sendVerifyEmail(newUser);
    console.log(`Sending verification email to: ${email}`);

    const { password: _, ...user } = newUser;

    return res.status(201).json(user); // return token ? or just regist status ?
  }

  async registSpecial(req: Request, res: Response, next: NextFunction) {

    const { firstName, lastName, password, email, username, type } = req.body;
    const specFields = [firstName, lastName, password, email, username, type]

    specFields.forEach(field =>{ if(field === ""){ throw new BadRequest(ErrorMessages.ALL_REQUIRED) }})

    console.log(`Registration Request for email: ${email}`);

    const userExists = await userRepository.findOneBy({ email });
    if (userExists) throw new BadRequest(ErrorMessages.USER_ALREADY_EXISTS);

    const token: string = (req.headers['r-access-token'] ?? "") as string
    if(!token) throw new BadRequest(ErrorMessages.TOKEN_REQUIRED)

    try{
      const decToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload
      const admin: any = await userRepository.findOneBy({id: decToken.userId})

      if( (admin.type == "admin" || admin.type == "superAdmin") && !admin.blocked){
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
          image: "default.gif",
          firstName,
          lastName,
          password: hashedPassword,
          email,
          username,
          type
        });

        await userRepository.save(newUser);
        console.log(`Registration Successful for email: ${email}`);

        EmailHelper.sendVerifyEmail(newUser);
        console.log(`Sending verification email to: ${email}`);

        const { password: _, ...user } = newUser;

        return res.status(201).json(user);

      }else throw new Unauthorized(ErrorMessages.ADMIN_NOT_FOUND)

    }catch (e){
      console.log(e)
      throw new BadRequest(ErrorMessages.INVALID_TOKEN)
    }
  }

  async loginPlatform(req: Request, res: Response, next: NextFunction) {
    const { password, email } = req.body;

    console.log(`Login Request for email: ${email}`);

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      console.log("INVALID EMAIL")
      throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      console.log("WRONG PASSWORD")
      throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    const token = jwt.sign({ userId: user.id, userEmail: user.email, userType: user.type }, process.env.JWT_SECRET ?? "", {
      expiresIn: "24h",
    });

    const { password: _, ...userLogin } = user;

    console.log(`Login Successful for email: ${email}`);

    return res.status(200).json({ user: {uImage: userLogin.image ,uId: userLogin.id, firstName: userLogin.firstName, lastName: userLogin.lastName, userEmail: userLogin.email, userType: userLogin.type, expTime: dat.format(new Date(), "DD/MM/YYYY") }, token: token });
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    const { password, email } = req.body;

    console.log(`Login Request for email: ${email}`);

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    if(user.type == "common") throw new Unauthorized(ErrorMessages.NO_PERMISSION)

    const token = jwt.sign({ userId: user.id, userEmail: user.email, userType: user.type }, process.env.JWT_SECRET ?? "", {
      expiresIn: "24h",
    });

    const { password: _, ...userLogin } = user;

    console.log(`Login Successful for email: ${email}`);

    return res.status(200).json({ user: {uImage: userLogin.image ,uId: userLogin.id, firstName: userLogin.firstName, lastName: userLogin.lastName, userEmail: userLogin.email, userType: userLogin.type, expTime: dat.format(new Date(), "DD/MM/YYYY")}, token: token });
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json(req.user);
  }

  // token in the url is a huge mistake, for now i will just workaround it
  async verifyUser(req: Request, res: Response, next: NextFunction) {
    let { userId, token } = req.params;

    console.log(`verifyUser Request for userId: ${userId}`);

    const user = await userRepository.findOneBy({ id: +userId });

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    try{
      const decodedToken = jwt.verify(token.replaceAll("=",''), process.env.JWT_SECRET ?? ""); // if token wrong then triggers the catch exception
      console.log(decodedToken)
      user.verified = true;
      await userRepository.save(user);
      console.log(`User with ID ${userId} verified`);

      return res.status(200).json(req.user);

    }catch (e){
      console.log("Exception: "+e)
      throw new BadRequest(ErrorMessages.INVALID_TOKEN)
    }
  }

  // TODO: have a proper look on this method
  async changePasswordRequest(req: Request, res: Response, next: NextFunction) {
    let { email } = req.params;

    console.log(`changePasswordRequest Request for email: ${email}`);

    const user = await userRepository.findOneBy({ email: email });

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    EmailHelper.sendChangePasswordEmail(user);
    console.log(`Send password reset email to: ${email}`);

    return res.status(200).json(req.user);
  }

  // TODO:
  // - have look on this method and adapt it (add try catch scope for token verification)
  async updateUserPassword(req: Request, res: Response, next: NextFunction) {
    let { userId, emailToken } = req.params;

    console.log(`updateUserPassword Request for userId: ${userId}`);

    const user = await userRepository.findOneBy({ id: +userId });

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    const decode = jwt.verify(emailToken, process.env.JWT_SECRET ?? "") as JwtPayload; // whats the purpose of this line ?

    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    console.log("Sucessfully updated password");

    await userRepository.save(user);

    return res.status(200).json({msg: "updated  "});
  }

  // TODO: create method to change password with old password verification
  async manualPasswordChange(req: Request, res: Response, next: NextFunction) {
    let { userId, token } = req.params;

    console.log(`manualPasswordChange Request for userId: ${userId}`);

    const user = await userRepository.findOneBy({ id: +userId });

    if (!user) {
      throw new BadRequest("User does not exist");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload; // whats the purpose of this line ?

    const { oldPassword, newPassword } = req.body;

    const vPass = await bcrypt.compare(oldPassword, user.password);
    if(!vPass) throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    console.log("Sucessfully updated password");

    await userRepository.save(user);

    return res.status(200).json({message: "Password changed!"});
  }

  /**
   * Method that updates user profile image
   * 
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  async updateProfileImg(req: Request, res: Response, next: NextFunction){
    try{
      if(!req.files || Object.keys(req.files).length === 0){  
        return res.status(400).json({message: "No file sent!"})

      }else{
        console.log("file recieved!")
        const recFile: UploadedFile = req.files.userImg as UploadedFile
        //const genFileName: string = await super._generateImgCode(recFile.name)
        const uploadPath = process.env.DIRNAME;

        console.log("Updating image on DataBase ...")
        if(req.user.id){
          const fileName: string = "user-"+req.user.id.toString() + ".gif"
          await super._updateImgDB(fileName, req.user.id)

          console.log("moving file ... " + uploadPath + fileName)
          recFile.mv(uploadPath + fileName , (err) => {
          if(err) return res.status(400).json({message: "some error occurred"+err})

          return res.status(200).json({message: "Image uploaded with success!", img: fileName})
        });
        
        }else{ return res.status(400).json({message: "User id not found!"})} 
      }
    }catch(e){
      throw e
    }
  }
}
