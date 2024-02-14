import { transporter } from "../app";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { IUser } from "../models/User";
import { IEmailVerificationTokens } from "../models/EmailVerificationTokens";
import { EmailVerificationTokensRepository } from "../database/EmailVerificationTokensRepository";
import { generateAcessToken, generateRefreshToken } from "../utils/jwtUtilities";
import UserService from "./UserService";

export class EmailService {
  static async SendVerifyEmail(user: IUser) {
    const currentURL = `localhost`; // TODO: get this from centrilized place

    const tokenInfo: middlewareTypes.JwtPayload = UserService.parseToTokenObj(user.id || 0, user.email, `${user.firstName} ${user.lastName}`, user.image, user.type);
    const token = generateAcessToken(tokenInfo);

    let emailVerificationTokensInstance = { token: token, userId: user.id };

    await EmailVerificationTokensRepository.Create(emailVerificationTokensInstance as IEmailVerificationTokens);

    const mailOptions = {
      from: "supp.evaclue@gmail.com",
      to: user.email,
      subject: "Welcome to Evaclue",
      html: /*html */
      `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">
          <title></title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style>
            table, td, div, h1, p {font-family: Arial, sans-serif;}
          </style>
        </head>
        <body style="margin:0;padding:0;">
          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
            <tr>
              <td align="center" style="padding:0;">
                <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                  <tr>
                    <td align="center" style="padding:40px 0 30px 0;background:black;color:white;">
                      <img width="250px" src="https://evaclue.com/evaclue_icons/logoEvaclue_v2.png" />
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:36px 30px 42px 30px;">
                      <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                        <tr>
                          <td style="padding:0 0 36px 0;color:#153643;">
        
                <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
                Welcome to Evaclue, ${user.firstName} ${user.lastName}! Please confirm your email address clicking on the link below.
                </p>
        
                <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
                Click<a href="http://${currentURL}/users/v1/verify/${user.id}/${token}"> here to verify.</a> (Link expires in 6 hours)
                </p>
                
                <p class="mt-8 text-gray-600 dark:text-gray-300">
                    Thanks, <br>
                    evalue team
                    <br><br> <span style="color:orange;font-size:9pt">This is a no reply email</span>
                </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px;background:black;">
                      <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                        <tr>
                          <td style="padding:0;width:50%;" align="left">
                            <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                              &reg; Evaclue, 2023<br/><a href="https://www.evaclue.com" style="color:#ffffff;text-decoration:underline;">https://www.evaclue.com</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `,
    };

    transporter.sendMail(mailOptions);
  }

  static async SendChangePasswordEmail(user: IUser) {
    const currentURL = `localhost:8011`;

    const tokenInfo: middlewareTypes.JwtPayload = UserService.parseToTokenObj(user.id || 0, user.email, `${user.firstName} ${user.lastName}`, user.image, user.type);
    const token = generateAcessToken(tokenInfo);

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
