import { NextFunction, Response, Request } from "express";
import "dotenv/config";
import UserService from "../services/UserService";
import { IUser } from "../models/User";

type JwtPayload = {
  userId: number;
  userEmail: string;
  userType: string;
};

export class UserController {
  async RegistUser(req: Request, res: Response, next: NextFunction) {
    const user = req.body as IUser;

    // Call to service layer.
    // Abstraction on how to access the data layer and the business logic.
    await UserService.Register(user, "common");

    return res.status(201); // return token ? or just regist status ?
  }

  async Teste(req: Request, res: Response, next: NextFunction) {
    console.log(req.user);
    console.log("teste");
    return res.status(200).json({ msg: "updated  " });
  }

  async RefreshToken(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;
    console.log("refreshing token: " + refreshToken);

    const accessToken = await UserService.RefreshToken(refreshToken);

    return res.status(200).json({ access_token: accessToken});
  }

  async Logout(req: Request, res: Response, next: NextFunction) {
    console.log(req.cookies);
    res.clearCookie("refreshToken");
    res.end()
    return res.status(200);
  }

  async LoginUser(req: Request, res: Response, next: NextFunction) {
    console.log("entrooo !")
    const user: IUser = req.body;

    const { acessToken, refreshToken } = await UserService.Login(user);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 3.123e10,
      httpOnly: true,
    });

    return res.status(200).json(acessToken);
  }

  async VerifyUser(req: Request, res: Response, next: NextFunction) {
    let { userId, token } = req.params;
    token = await UserService.VerifyUser(userId, token);
    return res.status(200).json(token);
  }

  async RecoverUserPasswordEmailRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let { email } = req.params;

    const user = UserService.RecoverUserPasswordEmailRequest(email);
    return res.status(200).json(user);
  }

  async ChangePassword(req: Request, res: Response, next: NextFunction) {
    let { userId } = req.params;

    let { password, oldPassword } = req.body;
    UserService.ChangePassword(userId, oldPassword, password);

    return res.status(200).json({ msg: "updated  " });
  }

  async RecoverPasswordConfirmation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let { password, token } = req.body;

    UserService.ChangePasswordWithToken(token, password);

    return res.status(200).json({ msg: "updated  " });
  }

  // async getUser(req: Request, res: Response, next: NextFunction) {
  //   const user = req.body as IUser;
  //   const token = await UserService.Login(user);

  //   return res.status(200).json(token);
  // }

  // async registAdmin(req: Request, res: Response, next: NextFunction) {

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

  // async loginAdmin(req: Request, res: Response, next: NextFunction) {
  //   const { password, email } = req.body;

  //   console.log(`Login Request for email: ${email}`);

  //   const user = await userRepository.findOneBy({ email });

  //   if (!user) {
  //     throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
  //   }

  //   const verifyPassword = await bcrypt.compare(password, user.password);

  //   if (!verifyPassword) {
  //     throw new BadRequest(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
  //   }

  //   if (user.type == "common") throw new Unauthorized(ErrorMessages.NO_PERMISSION)

  //   const token = jwt.sign({ userId: user.id, userEmail: user.email, userType: user.type }, process.env.JWT_SECRET ?? "", {
  //     expiresIn: "24h",
  //   });

  //   const { password: _, ...userLogin } = user;

  //   console.log(`Login Successful for email: ${email}`);

  //   return res.status(200).json({ user: { uImage: userLogin.image, uId: userLogin.id, firstName: userLogin.firstName, lastName: userLogin.lastName, userEmail: userLogin.email, userType: userLogin.type, expTime: dat.format(new Date(), "DD/MM/YYYY") }, token: token });
  // }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    console.log("is getting here")
    return res.status(200).json(req.user);
  }

  // /**
  //  * Method that updates user profile image
  //  *
  //  * @param req
  //  * @param res
  //  * @param next
  //  * @returns
  //  */
  // async updateProfileImg(req: Request, res: Response, next: NextFunction) {

  //   if (!req.files || Object.keys(req.files).length === 0) {
  //     return res.status(400).json({ message: "No file sent!" })
  //   }

  //   console.log("file received!")
  //   const recFile: UploadedFile = req.files.userImg as UploadedFile
  //   //const genFileName: string = await super._generateImgCode(recFile.name)
  //   const uploadPath = process.env.DIRNAME;

  //   console.log("Updating image on DataBase ...")
  //   if (req.user.id) {
  //     const fileName: string = "user-" + req.user.id.toString() + ".gif"
  //     await UserControllerHelper._updateImgDB(fileName, req.user.id)

  //     console.log("moving file ... " + uploadPath + fileName)
  //     recFile.mv(uploadPath + fileName, (err) => {
  //       if (err) return res.status(400).json({ message: "some error occurred" + err })

  //       return res.status(200).json({ message: "Image uploaded with success!", img: fileName })
  //     });

  //   } else { return res.status(400).json({ message: "User id not found!" }) }
  // }
}
