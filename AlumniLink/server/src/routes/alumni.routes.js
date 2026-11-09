import { Router } from 'express';
import { featured } from '../controllers/alumni.controller.js';

const router = Router();

router.get('/featured', featured);

export default router;
