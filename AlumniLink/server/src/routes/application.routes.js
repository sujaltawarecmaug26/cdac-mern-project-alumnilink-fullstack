import { Router } from 'express';
import * as application from '../controllers/job.controller.js';
import { authenticate } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import { ROLES } from '../utils/constants.js';

const router = Router();
router.use(authenticate);
router.get('/my', role(ROLES.STUDENT), application.myApplications);
router.get('/inbox', role(ROLES.ALUMNUS), application.inbox);
router.patch('/:id/status', role(ROLES.ALUMNUS), application.decide);
router.get('/:id/resume', role(ROLES.STUDENT, ROLES.ALUMNUS), application.resume);
router.get('/:id/contact', role(ROLES.STUDENT), application.contact);
export default router;
