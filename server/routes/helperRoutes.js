// routes/helperRoutes.js
import express from 'express';
import {
  applyAsHelper,
  getAllVerifiedHelpers,
  getHelperById,
  toggleAvailability
} from '../controllers/helperController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyAsHelper);
router.get('/directory', getAllVerifiedHelpers);
router.get('/:id', getHelperById);
router.put('/availability', protect, toggleAvailability);

export default router;
