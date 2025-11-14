import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

router.get('/sharedWithMe', async (req, res) => {
        const userId = req.userId;
        const sql = `SELECT * FROM shares WHERE user_id = ?`;
        const values = [userId];
        try {
                const [result] = await pool.promise().query(sql, values);
                if(result) {
                        res.send({
                                status: 200,
                                message: "Successfully got shared movies",
                                result: result
                        })
                }
        }
        catch(e) {
                res.send({
                        status: 500,
                        message: "Failed to get shared movies"
                })
        }
})

router.post("/shareReview", async (req, res) => {
        const { review_id, users } = req.body; 
        const sql = `INSERT INTO shares (user_id, review_id) VALUES (?, ?)`;
        users.forEach(async (id) => {
                const values = [id, review_id];
                try{
                        const [result] = await pool.promise().query(sql, values);
                        if(result.affectedRows > 0) {
                                res.send({
                                        status: 200,
                                        message: "Successfully shared movie"
                                })
                        }
                        else {
                                throw new Error("Failed to share movie");
                        }
                }
                catch(e) {
                        res.send({
                                status: 500,
                                message: e.message
                        })
                }
        });
});

export default router;