import { Router } from 'express';
import * as job from '../controllers/job.controller.js';
import { authenticate } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import { ROLES } from '../utils/constants.js';

const router = Router();
router.use(authenticate);
router.get('/', role(ROLES.STUDENT, ROLES.ALUMNUS, ROLES.ADMIN), job.list);
router.get('/mine', role(ROLES.ALUMNUS), job.mine);
router.post('/', role(ROLES.ALUMNUS), job.create);
router.get('/:id', role(ROLES.STUDENT, ROLES.ALUMNUS, ROLES.ADMIN), job.getOne);
router.put('/:id', role(ROLES.ALUMNUS), job.update);
router.patch('/:id/close', role(ROLES.ALUMNUS), job.close);
router.post('/:id/apply', role(ROLES.STUDENT), job.apply);
export default router;
