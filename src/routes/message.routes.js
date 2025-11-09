import { Router } from 'express';
import MessageController from '#controllers/message.controller.js';

const router = Router();

router.get('/:id', MessageController.getMessageById );
router.delete('/:id', MessageController.deleteMessage);

export default router;
