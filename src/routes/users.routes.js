import express from 'express';
import { authenticateUser, getAllUsers, getUser } from '../controllers/users.controller.js';

const router = express.Router();

// GET users listing
router.get('/', async function(req, res, next) {
    try {
        res.json(await getAllUsers(req.query.page));
    } catch (err) {
        console.error(`Error while getting users `, err.message);
        next(err);
    }
});

// GET single user
router.get('/:id', async function(req, res, next) {
    try {
        res.json(await getUser(req.params.id));
    } catch (err) {
        console.error(`Error while getting users `, err.message);
        next(err);
    }
});

// POST authenticate user
router.post('/auth', async function(req, res, next) {
    try {
        res.json(await authenticateUser(req.body.username, req.body.password));
    } catch (err) {
        console.error(`User not authenticated `, err.message);
        next(err);
    }
});


export default router;
