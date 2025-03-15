import {Pool} from "pg";
import "dotenv/config";


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port:5432,
});

export default pool;

// npm i --save-dev @types/pg download ini sebelum pake pool