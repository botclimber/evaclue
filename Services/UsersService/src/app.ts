import "express-async-errors";
import express from "express";
import fileUpload from "express-fileupload";
import routes from "./routes/post";
import getRoutes from "./routes/get";
import putRoutes from "./routes/update";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import helmet from "helmet";
import nodemailer from "nodemailer";
import "dotenv/config";
import { authMiddleware } from "./middlewares/authMiddleware";
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

const service: string = "users";
const version: string = "v1";

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
  origin: [`http://localhost:${process.env.loginPage_PORT}`, `http://localhost:${process.env.adminPage_PORT}`],
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
routes.get('/', (req, res ) => {

  // TODO: send service documentation instead
  res.status(200).json({msg: "IT WORKS!"})
});

app.use(`/${service}/${version}/`, routes);
app.use(`/${service}/${version}/`, getRoutes);
app.use(`/${service}/${version}/`, putRoutes);
app.use(errorMiddleware);



const port = process.env.users_PORT || 7000;
app.listen(port, () => {
  console.log(`Users Service is listening on PORT ${port}`);
});

console.log("Data Source has been initialized!");


// //app.use(helmet());







