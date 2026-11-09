import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';


const router = Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/me', authenticate, auth.me);
router.patch('/password', authenticate, auth.changePassword);
router.post('/forgot', auth.forgotPassword);
router.post('/reset', auth.resetPassword);

export default router;
