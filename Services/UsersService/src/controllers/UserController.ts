import { NextFunction, Response, Request } from "express";
import axios from "axios";
import "dotenv/config";
import UserService from "../services/UserService";
import { IUser } from "../models/User";
import { ErrorMessages } from "../helpers/Constants";
import { BadRequest } from "../helpers/ErrorTypes";
import { access } from "fs";

type JwtPayload = {
  userId: number;
  userEmail: string;
  userType: string;
};

export class UserController {
  async RegistUser(req: Request, res: Response, next: NextFunction) {
    const user = req.body as IUser;

    const { firstName, lastName, password, email } = user;
    const specFields = [firstName, lastName, password, email] // mandatory fields one can bypass JS validation on front-end

    specFields.forEach(field => { if (field === "") { return res.status(401).json({ msg: ErrorMessages.ALL_REQUIRED }); } })

    // Call to service layer.
    // Abstraction on how to access the data layer and the business logic.
    try {
      await UserService.Register(user, "common");

      console.log("User registed!")
      return res.status(201).end(); // TODO: return token and in front-end redirect to main platform

    } catch (e) {
      console.log(e)

      if (e instanceof (BadRequest)) return res.status(e.statusCode).json({ msg: e.message })
      else return res.status(500).send(e)
    }
  }

  async GoogleAuth(req: Request, res: Response, next: NextFunction) {
    const access_token: String | undefined = req.body.access_token

    console.log(`ACCESS_TOKEN recieved: ${access_token}`)
    if (access_token) {
      try {
        await axios
          .get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
          .then(async (response) => {
            const userInfo: GoogleUserType = response.data
            const tokenAndUserId = await UserService.GoogleUserAuth(userInfo)

            return res.status(200).json(tokenAndUserId);

          })
          .catch(err => {
            console.log(`Response from Google Auth API: ${err}`);
            res.status(err.response.status).json({ msg: err.response.data.msg });
          })


      } catch (e) {
        console.log(e)
        return res.status(500).send(e)
      }

    } else return res.status(401).json({ msg: ErrorMessages.ACCESS_TOKEN_REQUIRED });

  }

  async RegistUserAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.body as IUser;

    const { firstName, lastName, password, email } = user;
    const specFields = [firstName, lastName, password, email] // mandatory fields one can bypass JS validation on front-end

    specFields.forEach(field => { if (field === "") { return res.status(401).json({ msg: ErrorMessages.ALL_REQUIRED }); } })

    // Call to service layer.
    // Abstraction on how to access the data layer and the business logic.

    const token: string = (req.headers['authorization'] ?? "") as string
    if (!token) throw new BadRequest(ErrorMessages.TOKEN_REQUIRED)

    try {
      await UserService.RegisterAdmin(user, token);

      console.log("Colaborator registed!")
      return res.status(201).end(); // TODO: return token and in front-end redirect to main platform

    } catch (e) {
      console.log(e)

      if (e instanceof (BadRequest)) return res.status(e.statusCode).json({ msg: e.message })
      else return res.status(500).send(e)
    }
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

    return res.status(200).json({ access_token: accessToken });
  }

  // TODO: check if its necessary stil;l
  async Logout(req: Request, res: Response, next: NextFunction) {
    console.log(req.cookies);
    res.clearCookie("refreshToken");
    res.end()
    return res.status(200);
  }

  async LoginUser(req: Request, res: Response, next: NextFunction) {
    const user: IUser = req.body;

    const { acessToken, refreshToken, userId } = await UserService.Login(user);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 3.123e10,
      httpOnly: true, // TODO: this may cause issues in PROD
    });

    return res.status(200).json({accessToken: acessToken, userId: userId});
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

  // TODO: if its colaborator or owner request show full email otherwise hide it
  async getProfile(req: Request, res: Response, next: NextFunction) {

    const userId = () => {
      const userIdFromUrl = req.query.userId

      // TODO: verify also if its possible to convert to a number  ...
      if (userIdFromUrl && typeof userIdFromUrl === "string") return parseInt(userIdFromUrl)
      else return req.user.userId
    }

    const id = userId()

    if (id) {

      console.log("Getting user profile ...")
      const userData = await UserService.GetUserData(id)

      return res.status(200).json(userData);

    } else return res.status(401).json({ msg: "must send user ID within the request" })
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
