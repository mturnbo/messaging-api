import { Router } from 'express';
import MessageController from '#controllers/message.controller.js';
import { authMiddleware } from "#middlewares/auth.middleware.js";

const router = Router();

router.get('/:id', authMiddleware, MessageController.getMessageById );
router.post('/post', authMiddleware, MessageController.createMessage );
router.post('/read', authMiddleware, MessageController.readMessage);
router.delete('/:id', authMiddleware, MessageController.deleteMessage);

export default router;
