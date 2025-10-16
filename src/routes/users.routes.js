import express from 'express';
import { authenticateUser, getAllUsers, getUser } from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/token.js';
import { UserService } from "../services/user.service.js";

const router = express.Router();
const userService = new UserService();

// GET users listing
router.get('/', authenticateToken, async function(req, res, next) {
    try {
        const users = await getAllUsers(req.query.page);
        if (users.length === 0) {
            return res.status(404).json({ error: 'Users not found' });
        }
        return res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users', details: err.message });
        console.error(`Error while getting users `, err.message);
        next(err);
    }
});

// GET single user
router.get('/:id', authenticateToken, async function(req, res, next) {
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

// POST register new user
router.post('/register', authenticateToken, async function(req, res, next) {
    try {
        res.json(await userService.createUser(req.body));
    } catch (err) {
        console.error(`Error while creating user `, err.message);
        next(err);
    }
});

export default router;
