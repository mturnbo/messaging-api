import { Router } from 'express';
import UserController from '#controllers/user.controller.js';
import { authMiddleware } from "#middlewares/auth.middleware.js";

const router = Router();

router.get('/', authMiddleware, UserController.getAllUsers );
router.get('/:limit/:page', authMiddleware, UserController.getAllUsers );
router.get('/:id', authMiddleware, UserController.getUserById );
router.delete('/delete/:id', authMiddleware, UserController.deleteUser);

export default router;
