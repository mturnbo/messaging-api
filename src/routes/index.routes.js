import express from 'express';
import { pool } from '../db/connect.js';

const router = express.Router();

/* GET Index Page */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'User Messaging API' });
});


router.get('/db', function(req, res, next) {
    pool.getConnection()
        .then(connection => {
            console.log('✓ Database connected successfully');
            connection.release();
        })
        .catch(err => {
            console.error('✗ Database connection failed:', err.message);
            console.error('Please check your database configuration');
        });
});

export default router;
