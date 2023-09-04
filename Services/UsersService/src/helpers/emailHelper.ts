import { User } from "../../database/src/entities/Users";
import { transporter } from "../server";
import jwt from "jsonwebtoken";
import "dotenv/config";

export class EmailHelper {
  static async sendVerifyEmail(user: User) {
    const currentURL = `${process.env.HOST}:${process.env.users_PORT}`;

    // process.env.SECRET ?? "" can lead to security breach
    const token = jwt.sign({ userId: user.id, userEmail: user.email, userType: user.type }, process.env.SECRET ?? "", {
      expiresIn: "1h",
    });

    const mailOptions = {
      from: "supp.evaclue@gmail.com",
      to: user.email,
      subject: "Welcome to Evaclue",
      html: `<p>Welcome to Evaclue, ${user.firstName} ${user.lastName}! Please confirm your email address clicking on the link below.</p>
          <p>Link expirers in 6 hours</p>
          <p>Click<a href="${currentURL}/user/verify/${user.id}/${token}"> here to verify.</a></p>`,
    };

    transporter.sendMail(mailOptions);
  }

  static async sendChangePasswordEmail(user: User) {
    const currentURL = `${process.env.HOST}${process.env.CLIENT_PORT}`;

    const passwordToken = jwt.sign(
      { id: user.id },
      process.env.SECRET ?? "",
      {
        expiresIn: "2h",
      }
    );

    const mailOptions = {
      from: "supp.evaclue@gmail.com",
      to: user.email,
      subject: "Change password",
      html: `<p>Hello ${user.firstName} ${user.lastName}! To change your password click on the link below.</p>
          <p>Link expires in 1 hour</p>
          <p>Click<a href="${currentURL}/changePassword/${user.id}/${passwordToken}" here</a> to change password.</p>`,
    };

    transporter.sendMail(mailOptions);
  }
}
