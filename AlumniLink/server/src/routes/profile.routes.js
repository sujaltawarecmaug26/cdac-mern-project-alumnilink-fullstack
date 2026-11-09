import { Router } from 'express';
import * as profile from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import { uploadResume } from '../middleware/upload.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authenticate);
router.get('/me', role(ROLES.STUDENT, ROLES.ALUMNUS), profile.getMe);
router.put('/student', role(ROLES.STUDENT), profile.updateStudent);
router.put('/alumni', role(ROLES.ALUMNUS), profile.updateAlumni);
router.post('/resume', role(ROLES.STUDENT), uploadResume, profile.uploadResume);
router.get('/resume/file', role(ROLES.STUDENT), profile.viewOwnResume);

export default router;
