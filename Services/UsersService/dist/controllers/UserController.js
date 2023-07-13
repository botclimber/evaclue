"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
require("dotenv/config");
const UserService_1 = __importDefault(require("../services/UserService"));
class UserController {
    async registUser(req, res, next) {
        const user = req.body;
        // Call to service layer.
        // Abstraction on how to access the data layer and the business logic.
        await UserService_1.default.Register(user);
        return res.status(201).json(user); // return token ? or just regist status ?
    }
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
    async loginUser(req, res, next) {
        const user = req.body;
        const token = await UserService_1.default.Login(user);
        return res.status(200).json(token);
    }
}
exports.UserController = UserController;
