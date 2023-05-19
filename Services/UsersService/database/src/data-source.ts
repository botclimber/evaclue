import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";

console.log(process.env.HOST);

export const myDataSource = new DataSource({
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
