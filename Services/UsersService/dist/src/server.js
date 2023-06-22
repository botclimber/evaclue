"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
require("express-async-errors");
const data_source_1 = require("../database/src/data-source");
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const routes_1 = __importDefault(require("./routes/routes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
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
// establish database connection
data_source_1.myDataSource
    .initialize()
    .then(() => {
    const app = (0, express_1.default)();
    //app.use(helmet());
    const corsOptions = {
        origin: "*",
        credentials: true,
        optionSuccessStatus: 200,
    };
    app.use(express_1.default.json());
    app.use(cors(corsOptions)); // Use this after the variable declaration
    app.use((0, express_fileupload_1.default)());
    app.use("/user", routes_1.default);
    app.use(errorMiddleware_1.errorMiddleware);
    const port = process.env.SERVER_PORT || 7000;
    app.listen(port, () => {
        console.log(`${port}`);
    });
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
// app.set("view engine", "ejs")
