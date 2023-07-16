import "express-async-errors";
import express from "express";
import fileUpload from "express-fileupload";
import routes from "./routes/Post";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import helmet from "helmet";
import nodemailer from "nodemailer";
import "dotenv/config";
import session from 'express-session'
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
  exposedHeaders: ['set-cookie']
};

const mysqlStore = require('express-mysql-session')(session);

const options = {
  connectionLimit: 10,
  user: 'root',
  password: 'admin',
  database: 'evaclue_db',
  host: 'localhost',
  //  port: process.env.DB_PORT,
  createDatabaseTable: true

}

const sessionStore = new mysqlStore(options);
const app = express();
app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.set('trust proxy', 1)
app.use(session({
  name: "testeSession",
  resave: true,
  saveUninitialized: true,
  store: sessionStore,
  secret: "teste",
  // cookie: {
  //   httpOnly: true,
  //   maxAge: 5000,
  //   sameSite: 'none',
  //   secure: false
  // }
}));

app.use(express.json());
app.use(fileUpload())
app.use("/user", routes);
app.use(errorMiddleware);

app.get('/set', function (req, res) {
  req.session.user = { name: 'Chetan' };
  req.session.save();
  res.send(req.session.user);
});

app.get('/get', function (req, res) {
  console.log(req.session.user);
  res.send(req.session.user);
});

const port = process.env.SERVER_PORT || 7000;
app.listen(port, () => {
  console.log(`${port}`);
});

console.log("Data Source has been initialized!");


// //app.use(helmet());







