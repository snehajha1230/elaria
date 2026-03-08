import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getRooms,
  updateRoomPrivacy,
  getFriendPublicRooms
} from '../controllers/roomController.js';

const router = express.Router();

router.route('/')
  .get(protect, getRooms);

router.route('/:roomId')
  .put(protect, updateRoomPrivacy);

// Consolidated to single endpoint
router.route('/friends/:friendId/rooms')
  .get(protect, getFriendPublicRooms);

export default router;