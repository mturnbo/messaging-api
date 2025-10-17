import express from 'express';
import { getMessage } from '../controllers/messages.controller.js';
import { authenticateToken } from '../middlewares/token.js';

const router = express.Router();

// GET message
router.get('/:id', authenticateToken, async function(req, res, next) {
    try {
        res.json(await getMessage(req.params.id));
    } catch (err) {
        console.error(`Error while getting message `, err.message);
        next(err);
    }
});

export default router;
