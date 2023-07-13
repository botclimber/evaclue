import mysql, { ConnectionOptions } from 'mysql2';

export class Database {

    static Access: ConnectionOptions = {
        user: 'root',
        password: 'admin',
        database: 'evaclue_db',
        host: 'localhost'
    };
}