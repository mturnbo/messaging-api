import { Router } from 'express';
import UserController from '#controllers/user.controller.js';
import { authMiddleware } from "#middlewares/auth.middleware.js";

const router = Router();


router.get('/', UserController.getAllUsers );
router.get('/:id', UserController.getUserById );
router.delete('/:id', authMiddleware, UserController.deleteUser);

export default router;
