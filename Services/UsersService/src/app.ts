import "express-async-errors";
import express from "express";
import fileUpload from "express-fileupload";
import routes from "./routes/Post";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import helmet from "helmet";
import nodemailer from "nodemailer";
import "dotenv/config";

const cors = require("cors");

const SMTP_CONFIG = require("./config/smtp");
export const transporter = nodemailer.createTransport({
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.port,
  secure: false,
  auth: {
    user: SMTP_CONFIG.user,
    pass: SMTP_CONFIG.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const app = express();
//app.use(helmet());

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(fileUpload())
app.use("/user", routes);
app.use(errorMiddleware);

const port = process.env.SERVER_PORT || 7000;
app.listen(port, () => {
  console.log(`${port}`);
});

console.log("Data Source has been initialized!");

