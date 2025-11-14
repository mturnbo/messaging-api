import { Router } from 'express';
import UserController from '#controllers/user.controller.js';
import { authMiddleware } from "#middlewares/auth.middleware.js";

const router = Router();

router.get('/all/:limit/:page', authMiddleware, UserController.getAllUsers );
router.get('/:id', authMiddleware, UserController.getUserById );
router.delete('/:id', authMiddleware, UserController.deleteUser);

export default router;
