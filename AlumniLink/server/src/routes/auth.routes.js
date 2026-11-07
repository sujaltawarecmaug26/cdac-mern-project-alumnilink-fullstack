import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotSchema,
  resetSchema,
} from '../validators/auth.schema.js';

const router = Router();

router.post('/register',validate(registerSchema), auth.register);
router.post('/login', validate(loginSchema), auth.login);
router.get('/me', authenticate, auth.me);
router.patch('/password', authenticate, validate(changePasswordSchema), auth.changePassword);
router.post('/forgot', validate(forgotSchema), auth.forgotPassword);
router.post('/reset', validate(resetSchema), auth.resetPassword);

export default router;
