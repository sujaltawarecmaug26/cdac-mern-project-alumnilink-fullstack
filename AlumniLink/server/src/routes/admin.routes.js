import { Router } from 'express';
import * as admin from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { verifyAlumniSchema, verifyAlumniParamSchema, adminAlumniQuerySchema, adminUsersQuerySchema } from '../validators/admin.schema.js';
import { ROLES } from '../utils/constants.js';

const router = Router();
router.use(authenticate, role(ROLES.ADMIN));
router.get('/alumni', validate(adminAlumniQuerySchema, 'query'), admin.listAlumni);
router.patch('/alumni/:userId', validate(verifyAlumniParamSchema, 'params'), validate(verifyAlumniSchema), admin.verifyAlumni);
router.get('/users', validate(adminUsersQuerySchema, 'query'), admin.listUsers);
export default router;
