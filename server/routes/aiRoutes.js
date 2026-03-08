import express from 'express';
import { handleTextAI } from '../controllers/aiController.js';

const router = express.Router();

router.post('/text', handleTextAI);

export default router;

