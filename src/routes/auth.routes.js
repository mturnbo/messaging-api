import { Router } from 'express';
import AuthenticationController from '#controllers/auth.controller.js';

const router = Router();

router.get('/test', function(req, res, next) {
  res.json( { title: 'Auth Router' });
});

// POST authenticate user
router.post('/',  AuthenticationController.authenticateUser);

export default router;
