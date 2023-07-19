import { transporter } from "../app";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { IUser } from "../models/User";
import { IEmailVerificationTokens } from "../models/EmailVerificationTokens";
import { EmailVerificationTokensRepository } from "../database/EmailVerificationTokensRepository";
import { generateAcessToken, generateRefreshToken } from "../utils/jwtUtilities";

export class EmailService {
  static async SendVerifyEmail(user: IUser) {
    const currentURL = `localhost:7000`;

    const token = generateAcessToken(user);

    let emailVerificationTokensInstance = { token: token, userId: user.id };

    await EmailVerificationTokensRepository.Create(emailVerificationTokensInstance as IEmailVerificationTokens);

    const mailOptions = {
      from: "supp.evaclue@gmail.com",
      to: user.email,
      subject: "Welcome to Evaclue",
      html: `<p>Welcome to Evaclue, ${user.firstName} ${user.lastName}! Please confirm your email address clicking on the link below.</p>
          <p>Link expires in 6 hours</p>
          <p>Click<a href="http://${currentURL}/user/verify/${user.id}/${token}"> here to verify.</a></p>`,
    };

    transporter.sendMail(mailOptions);
  }

  static async SendChangePasswordEmail(user: IUser) {
    const currentURL = `localhost:8011`;

    const token = generateAcessToken(user);

    const mailOptions = {
      from: "supp.evaclue@gmail.com",
      to: user.email,
      subject: "Change password",
      html: `<p>Hello ${user.firstName} ${user.lastName}! To change your password click on the link below.</p>
          <p>Link expires in 1 hour</p>
          <p>Click<a href="http://${currentURL}/user/recover-password/confirmation/${token}" here</a> to change password.</p>`,
    };

    transporter.sendMail(mailOptions);
  }
}
