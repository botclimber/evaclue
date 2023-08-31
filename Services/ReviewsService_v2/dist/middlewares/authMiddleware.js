"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errorMessages_1 = require("../helpers/errorMessages");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function deToken(token) { var _a; return jsonwebtoken_1.default.verify(token, (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : ""); }
const authMiddleware = async (req, res, next) => {
    console.log(req);
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(errorMessages_1.errorMessages.TOKEN_REQUIRED.status).json({ msg: errorMessages_1.errorMessages.TOKEN_REQUIRED.text });
        throw Error(errorMessages_1.errorMessages.TOKEN_REQUIRED.text);
    }
    const token = authorization.split(" ")[1];
    const { userId, userEmail, userType } = deToken(token);
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
exports.authMiddleware = authMiddleware;
