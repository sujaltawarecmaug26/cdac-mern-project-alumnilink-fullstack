import { Router } from 'express';
import * as profile from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.js';
import { role } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { uploadResume } from '../middleware/upload.js';
import { studentProfileSchema, alumniProfileSchema } from '../validators/profile.schema.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authenticate);
router.get('/me', role(ROLES.STUDENT, ROLES.ALUMNUS), profile.getMe);
router.patch('/name', role(ROLES.STUDENT, ROLES.ALUMNUS), profile.updateName);
router.put('/student', role(ROLES.STUDENT), validate(studentProfileSchema), profile.updateStudent);
router.put('/alumni', role(ROLES.ALUMNUS), validate(alumniProfileSchema), profile.updateAlumni);
router.post('/resume', role(ROLES.STUDENT), uploadResume, profile.uploadResume);
router.get('/resume/file', role(ROLES.STUDENT), profile.viewOwnResume);

export default router;
