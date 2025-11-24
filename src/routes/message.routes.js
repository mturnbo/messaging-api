import { Router } from 'express';
import MessageController from '#controllers/message.controller.js';
import { authMiddleware } from "#middlewares/auth.middleware.js";

const router = Router();

// GET message by id
router.get('/:id', authMiddleware, MessageController.getMessageById );

// POST new message
router.post('/post', authMiddleware, MessageController.createMessage );

// POST update message read status
router.post('/read', authMiddleware, MessageController.readMessage);

// POST delete message
router.post('/delete', authMiddleware, MessageController.deleteMessage);

export default router;
