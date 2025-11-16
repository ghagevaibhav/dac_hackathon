import mysql from 'mysql2';

const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSOWRD,
        database: 'hackathon'
});

export default pool;