import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

const app = express();

function middleware (req, res, next) {
        if(req.url == '/users/register' || req.url == "/users/signin") next() 
        else {
                const authToken = req.headers.authorization;
                if(!authToken) {
                        res.send({
                                status: 404,
                                message: "Token not provided!"
                        })
                }           
                const token = authToken.split(" ")[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                console.log(decoded);
                if(!decoded) {
                        res.send({
                                status: 401,
                                message: "Invalid Token!"
                        })
                }
                else {
                        req.userId = decoded.userId;
                        next();
                }
        }
}

export default middleware;