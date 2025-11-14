import mysql from 'mysql2';

const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'Makichu#123',
        database: 'hackathon'
});

export default pool;