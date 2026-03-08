import express from 'express';
import {
  getUsers,
  sendFriendRequest,
  getFriendRequests,
  handleRequest,
  cancelRequest,
  getFriends,
  removeFriend
} from '../controllers/friendController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, getUsers);
router.post('/requests/:userId', protect, sendFriendRequest);
router.get('/requests', protect, getFriendRequests);
router.put('/requests/:requestId', protect, handleRequest);
router.delete('/requests/:requestId', protect, cancelRequest);
router.get('/', protect, getFriends);
router.delete('/:friendId', protect, removeFriend);

export default router;
