import express from 'express';
import {
  getDiaryEntries,
  getPublicDiaryEntries,
  createDiaryEntry,
  deleteDiaryEntry
} from '../controllers/diaryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - no authentication required
router.get('/public/:friendId', 
  // Optional: Add rate limiting here to prevent abuse
  getPublicDiaryEntries
);

// Authenticated routes
router.use(authMiddleware);

router.get('/', getDiaryEntries);
router.post('/', 
  // Optional: Add validation middleware here
  createDiaryEntry
);
router.delete('/:id', deleteDiaryEntry);

export default router;