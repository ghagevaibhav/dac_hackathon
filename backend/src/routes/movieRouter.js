import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

router.get("/", async (req, res) => {
        const sql = `SELECT * FROM movies`;
        
        try {
                const [result] = await pool.promise().query(sql, []);
                res.send(result);
        } catch(error) {
                res.status(500).send(error);
        }
})


router.get('/movie:id', async (req, res) => {
        const { id } = req.params;
        const sql = `SELECT * FROM movies WHERE id = ?`;
})

export default router;