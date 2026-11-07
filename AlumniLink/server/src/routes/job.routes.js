import { Router } from 'express';
import * as job from '../controllers/job.controller.js';
import { authenticate } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { jobSchema, applicationSchema, idParamSchema, jobQuerySchema } from '../validators/job.schema.js';
import { ROLES } from '../utils/constants.js';

const router = Router();
router.use(authenticate);
router.get('/', role(ROLES.STUDENT, ROLES.ALUMNUS, ROLES.ADMIN), validate(jobQuerySchema, 'query'), job.list);
router.get('/mine', role(ROLES.ALUMNUS), job.mine);
router.post('/', role(ROLES.ALUMNUS), validate(jobSchema), job.create);
router.get('/:id', role(ROLES.STUDENT, ROLES.ALUMNUS, ROLES.ADMIN), validate(idParamSchema, 'params'), job.getOne);
router.put('/:id', role(ROLES.ALUMNUS), validate(idParamSchema, 'params'), validate(jobSchema.partial()), job.update);
router.patch('/:id/close', role(ROLES.ALUMNUS), validate(idParamSchema, 'params'), job.close);
router.post('/:id/apply', role(ROLES.STUDENT), validate(idParamSchema, 'params'), validate(applicationSchema), job.apply);
export default router;
