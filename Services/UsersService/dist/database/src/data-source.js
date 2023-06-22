"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
require("dotenv/config");
console.log(process.env.HOST);
exports.myDataSource = new typeorm_1.DataSource({
    type: "mysql",
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    synchronize: false,
    logging: false,
    entities: [`${__dirname}/**/entities/*.{ts,js}`],
    migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
    subscribers: [],
});
