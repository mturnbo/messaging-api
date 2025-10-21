import express from 'express';
import { getMessage } from '../controllers/messages.controller.js';
import { MessageService } from '../services/message.service.js';
import { authenticateToken } from '../middlewares/token.js';

const router = express.Router();
const messageService = new MessageService();

// GET message
router.get('/:id', authenticateToken, async function(req, res, next) {
    try {
        res.json(await getMessage(req.params.id));
    } catch (err) {
        console.error(`Error while getting message `, err.message);
        next(err);
    }
});

// POST new message
/*
Accepts message params:
- senderId
- recipientId
- subject
- body
- senderAddress
 */
router.post('/post', authenticateToken, async function(req, res, next) {
    try {
        res.json(await messageService.createMessage(req.body));
    } catch (err) {
        console.error(`Error while creating message `, err.message);
        next(err);
    }
});

export default router;
