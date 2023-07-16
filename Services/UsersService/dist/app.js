"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const cookieParser = require("cookie-parser");
const express_session_1 = __importDefault(require("express-session"));
const cors = require("cors");
const SMTP_CONFIG = require("./config/smtp");
exports.transporter = nodemailer_1.default.createTransport({
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
const app = (0, express_1.default)();
//app.use(helmet());
const corsOptions = {
    origin: "http://localhost:8011",
    credentials: true,
    optionSuccessStatus: 200,
    exposedHeaders: ['set-cookie']
};
const mysqlStore = require('express-mysql-session')(express_session_1.default);
const options = {
    connectionLimit: 10,
    user: 'root',
    password: 'admin',
    database: 'evaclue_db',
    host: 'localhost',
    //  port: process.env.DB_PORT,
    createDatabaseTable: true
};
const sessionStore = new mysqlStore(options);
app.use((0, express_session_1.default)({
    name: "testeSession",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: "teste",
    cookie: {
        httpOnly: true,
        maxAge: 5000,
        sameSite: true,
        secure: true
    }
}));
app.use(cookieParser());
app.use(express_1.default.json());
//app.use(cors(corsOptions)); // Use this after the variable declaration
//app.set('trust proxy', 1);
// app.use(fileUpload())
// app.use("/user", routes);
// app.use(errorMiddleware);
app.get('/set', function (req, res) {
    req.session.user = { name: 'Chetan' };
    req.session.save();
    res.send(req.session.user);
});
app.get('/get', function (req, res) {
    res.send(req.session.user);
});
const port = process.env.SERVER_PORT || 7000;
app.listen(port, () => {
    console.log(`${port}`);
});
console.log("Data Source has been initialized!");
