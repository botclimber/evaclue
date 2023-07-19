import "express-async-errors";
import express from "express";
import fileUpload from "express-fileupload";
import routes from "./routes/Post";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import helmet from "helmet";
import nodemailer from "nodemailer";
import "dotenv/config";
import { authMiddleware } from "./middlewares/authMiddleware";
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

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

const corsOptions = {
  origin: "http://localhost:8011",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  //exposedHeaders: ['set-cookie']
};

const app = express();
app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())


app.use(express.json());
app.use(fileUpload())
app.use("/user", routes);
app.use(errorMiddleware);



const port = process.env.SERVER_PORT || 7000;
app.listen(port, () => {
  console.log(`${port}`);
});

console.log("Data Source has been initialized!");


// //app.use(helmet());







