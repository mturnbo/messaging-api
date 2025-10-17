import express from 'express';
import { pool } from '../db/connect.js';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/* GET Index Page */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'User Messaging API' });
});


router.get('/db', function(req, res, next) {
    console.log(`Attempting connection to MySQL on ${process.env.MYSQL_HOST} | ${process.env.MYSQL_USER} | ${process.env.MYSQL_DATABASE}`);
    pool.getConnection()
        .then(connection => {
            console.log(`✓ Database connected successfully`);
            connection.release();
        })
        .catch(err => {
            console.error('✗ Database connection failed:', err.message);
            console.error('Please check your database configuration');
        });
});

/* GET Index Page */
router.get('/env', function(req, res, next) {
    res.render('index', { title: 'User Messaging API' });
});

export default router;
