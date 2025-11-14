import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

router.get('/allReviews', async (req, res) => {
        const sql = `SELECT * FROM reviews`;
        try {
                const [result] = await pool.promise().query(sql, []);
                res.send(result);
        } catch(error) {
                res.status(500).send(error);
        }
})



router.post('/createReview', async (req, res) => {
        const { movie_id, review } = req.body;
        const user_id = req.userId

        const sql = `INSERT INTO reviews (movie_id, review, user_id) VALUES (?, ?, ?)`;
        const values = [movie_id, review, user_id];

        try {
                const [result] = await pool.promise().query(sql, values);
                if(result.affectedRows > 0) {
                        res.send({
                                status: 200,
                                message: "Movie Review Created Successfully"
                        })
                }
                else {
                        throw new Error("Movie Review Creation Failed");
                }
        }
        catch(err) {
                res.send({
                        status: 500,
                        message: err.message
                })
        }
})

router.post('/updateReview', async (req, res) => {
        const { movie_id, review } = req.body;
        const user_id = req.userId;
        const sql = `UPDATE reviews SET review = ? WHERE movie_id = ? AND user_id = ?`;
        const values = [review, movie_id, user_id];
        try {
                const [result] = await pool.promise().query(sql, values);
                if(result.affectedRows > 0) {
                        res.send({
                                status: 200,
                                message: "Movie Review Updated Successfully"
                        })
                }
                else {
                        throw new Error("Movie Review Update Failed");
                }
        }
        catch(err) {
                res.send({
                        status: 500,
                        message: e.message
                })
        }
})

router.delete('/deleteReview', async (req, res) => {
        const { movie_id } = req.body;
        const user_id = req.userId;

        const sql = 'DELETE FROM reviews WHERE movie_id = ? AND user_id = ?';
        const values = [movie_id, user_id];
        try {
                const [result] = await pool.promise().query(sql, values);
                if(result.affectedRows > 0) {
                        res.send({
                                status: 200,
                                message: "Movie Review Deleted Successfully"
                        })
                }
                else {
                        throw new Error("Movie Review Deletion Failed");
                }
        }
        catch(e) {
                res.send({
                        status: 500,
                        message: e.message
                })
        }
})

export default router;