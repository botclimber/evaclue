import { transporter } from "../app";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { IUser } from "../models/User";

export class EmailService {
  static async SendVerifyEmail(user: IUser) {
    const currentURL = `localhost:7000`;

    // process.env.JWT_SECRET ?? "" can lead to security breach
    const token = jwt.sign({ userId: user.id, userEmail: user.email, userType: user.type }, "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo", {
      expiresIn: "1h",
    });

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
    const currentURL = `${process.env.HOST}${process.env.CLIENT_PORT}`;

    const passwordToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET ?? "",
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
