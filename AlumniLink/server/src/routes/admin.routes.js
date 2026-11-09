import { Router } from 'express';
import * as admin from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import { ROLES } from '../utils/constants.js';

const router = Router();
router.use(authenticate, role(ROLES.ADMIN));
router.get('/alumni', admin.listAlumni);
router.patch('/alumni/:userId',admin.verifyAlumni);
router.get('/users', admin.listUsers);
export default router;
