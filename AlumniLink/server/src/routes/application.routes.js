import { Router } from 'express';
import * as application from '../controllers/job.controller.js';
import { authenticate } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { decisionSchema, idParamSchema, applicationQuerySchema } from '../validators/job.schema.js';
import { ROLES } from '../utils/constants.js';

const router = Router();
router.use(authenticate);
router.get('/my', role(ROLES.STUDENT), application.myApplications);
router.get('/inbox', role(ROLES.ALUMNUS), validate(applicationQuerySchema, 'query'), application.inbox);
router.patch('/:id/status', role(ROLES.ALUMNUS), validate(idParamSchema, 'params'), validate(decisionSchema), application.decide);
router.get('/:id/resume', role(ROLES.STUDENT, ROLES.ALUMNUS), validate(idParamSchema, 'params'), application.resume);
router.get('/:id/contact', role(ROLES.STUDENT), validate(idParamSchema, 'params'), application.contact);
export default router;
