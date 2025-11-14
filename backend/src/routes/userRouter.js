import express from 'express';
import bcrypt from 'bcrypt';
import { changePasswordSchema, editProfileSchema, registerSchema, signInSchema } from '../util/schemas.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import pool from '../db/db.js';

const router = express.Router();

router.get("/allUsers", async (req, res) => {
        const sql = `SELECT * FROM users`;
        try{
                const [result] = await pool.promise().query(sql, []);
                res.send(result);
        }
        catch(err) {
                res.send({
                        status: 404,
                        message: "Failed to get all users"
                })
        }
}) 

router.post('/register', async (req, res) => {
        const { first_name, last_name, email, password, mobile, birth } = req.body;
        const parsedSchema = await registerSchema.safeParseAsync(req.body);
        if(parsedSchema.success) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const sql = `INSERT INTO users (first_name, last_name, email, password, mobile, birth) VALUES (?, ?, ?, ?, ?, ?)`;
                const values = [first_name, last_name, email, hashedPassword, mobile, birth];
                try {
                        const [result] = await pool.promise().query(sql, values);
                        console.log(result);
                        res.send({
                                status: 200,
                                message: "Successfully Registered",
                                result: result
                        });
                } catch(error) {
                        res.status(500).send(error);
                }
        }
        else {
                res.send(parsedSchema.error);
        }
});

router.post('/signin', async (req, res) => {
        const { email, password } = req.body;   
        const parsedSchema = await signInSchema.safeParseAsync(req.body);
        if(parsedSchema.success) {
                const sql = `SELECT * FROM users WHERE email = ?`;
                const values = [email];
                try {
                        const [result] = await pool.promise().query(sql, values);
                        console.log(result);
                        if(result.length > 0) {
                                const user = result[0];
                                console.log(user);
                                const isPasswordCorrect = await bcrypt.compare(password, user.password);
                                if(isPasswordCorrect) {
                                        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
                                        res.send({
                                                status: 200,
                                                message: "Successfully Signed In",
                                                token: token
                                        });
                                }
                                else {
                                        res.send({
                                                status: 401,
                                                message: "Invalid Credentials"
                                        });
                                }
                        }
                        else {
                                res.send({
                                        status: 404,
                                        message: "User Not Found"
                                });
                        }
                } catch(error) {
                        res.status(500).send(error);
                }
         }
        else {
                res.send(parsedSchema.error);
        }
})

router.post('/changePassword', async (req, res) => {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if(newPassword !== confirmPassword) {
                res.send({
                        status: 400,
                        message: "Passwords do not match!"
                });
        }

        if(newPassword === currentPassword) {
                res.send({
                        message: "New Password cannot be same as Current Password",
                        status: 400
                })
        }

        const userId = req.userId;

        const parsedSchema = await changePasswordSchema.safeParseAsync(req.body);
        if(parsedSchema.success) {
                const sql = `SELECT * FROM users WHERE id = ?`;
                const values = [userId];
                try {
                        const [result] = await pool.promise().query(sql, values);
                        console.log(result);
                        if(result.length > 0) {
                                const user = result[0];
                                console.log(user);
                                const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
                                if(isPasswordCorrect) {
                                        const newPasswordHash = await bcrypt.hash(newPassword, 10);
                                        const sql = `UPDATE users SET password = ? WHERE id = ?`;
                                        const values = [newPasswordHash, userId];
                                        try {
                                                const [result] = await pool.promise().query(sql, values);
                                               
                                        } catch(error) {
                                                res.status(500).send({
                                                        error,
                                                        message: "Password Update Failed"
                                                });
                                        }
                                        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
                                        res.send({ 
                                                status: 200,
                                                message: "Password Changed Successfully",
                                                token: token
                                        });
                                }
                                else {
                                        res.send({
                                                status: 401,
                                                message: "Invalid Credentials"
                                        });
                                }
                        }
                        else {
                                res.send({
                                        status: 404,
                                        message: "User Not Found"
                                });
                        }
                } catch(error) {
                        res.status(500).send(error);
                }
         }
        else {
                res.send(parsedSchema.error);
        }
})

router.patch('/editProfile', async (req, res) => {
        const { first_name, last_name, email, mobile, birth } = req.body;
        const userId = req.userId;
        const parsedSchema = await editProfileSchema.safeParseAsync(req.body);

        if(parsedSchema.success) {
                const sql = `SELECT * FROM users WHERE id = ?`;
                const values = [userId];
                try {                
                        const [result] = await pool.promise().query(sql, values);
                        const user = result[0];
                        const sql2 = `UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile = ?, birth = ? WHERE id = ?`;
                        const values2 = [
                                first_name ?? user.first_name,
                                last_name ?? user.last_name,
                                email ?? user.email,
                                mobile ?? user.mobile,
                                birth ?? user.birth,
                                userId
                        ];
                        try {
                                const [result] = await pool.promise().query(sql2, values2);
                                if(result.affectedRows > 0) {
                                        res.send({
                                                status: 200,
                                                message: "Profile Updated Successfully"
                                        })
                                }
                                else {
                                        throw new Error("Profile Update Failed");
                                }
                        }
                        catch(e) {
                                res.send({
                                        status: 500,
                                        message: e.message
                                })
                        }                        
                }
                catch(err) {
                        res.send({
                                status: 500,
                                message: "Invalid Profile Update Input"
                        })
                }
        }
})

export default router;