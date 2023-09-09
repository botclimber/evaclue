import mysql, { ConnectionOptions } from 'mysql2';

export class Database {

    // static Access: ConnectionOptions = {
    //     user: process.env.DB_USER,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_NAME,
    //     host: process.env.DB_HOST
    // };

    static Access: ConnectionOptions = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST
    };
}