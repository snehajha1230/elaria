// backend/routes/diagnoseRoutes.js
import express from 'express';
import { evaluateDiagnosis } from '../controllers/diagnoseController.js';

const router = express.Router();

router.post('/', evaluateDiagnosis);

export default router;
