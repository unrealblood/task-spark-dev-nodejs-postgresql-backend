import { Pool } from "pg";

export const pool = new Pool({
    user: process.env.POSTGRESQL_USER_NAME,
    password: process.env.POSTGRESQL_USER_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE_NAME,
    port: process.env.POSTGRESQL_CONNECTION_PORT,
    host: "localhost"
});