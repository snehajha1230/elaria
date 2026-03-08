import express from 'express';
import { addMood, getLatestMood } from '../controllers/moodController.js';
import { protect } from '../middleware/authMiddleware.js'; // assumes you have user auth

const router = express.Router();

router.post('/', protect, addMood);
router.get('/latest', protect, getLatestMood);

export default router;
