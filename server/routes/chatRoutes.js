import express from 'express';
import { body, param } from 'express-validator';
import {
  requestChat,
  getHelperRequests,
  respondToRequest,
  getActiveChats,
  getChatSession,
  sendMessage,
  getChatByRequestId
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Chat request routes
router.post(
  '/request',
  protect,
  [
    body('helperId')
      .notEmpty()
      .withMessage('Helper ID is required')
      .isMongoId()
      .withMessage('Invalid helper ID format')
  ],
  validateRequest,
  requestChat
);

router.get('/requests', protect, getHelperRequests);

router.post(
  '/respond',
  protect,
  [
    body('requestId')
      .notEmpty()
      .withMessage('Request ID is required')
      .isMongoId()
      .withMessage('Invalid request ID format'),
    body('response')
      .notEmpty()
      .withMessage('Response is required')
      .isString()
      .withMessage('Response must be a string')
      .isIn(['accept', 'decline'])
      .withMessage('Response must be either "accept" or "decline"')
  ],
  validateRequest,
  respondToRequest
);

// Active chats
router.get('/active', protect, getActiveChats);

// Chat session routes
router.get(
  '/:chatId',
  protect,
  [
    param('chatId')
      .notEmpty()
      .withMessage('Chat ID is required')
      .isMongoId()
      .withMessage('Invalid chat ID format')
  ],
  validateRequest,
  getChatSession
);

router.post(
  '/:chatId/messages',
  protect,
  [
    param('chatId')
      .notEmpty()
      .withMessage('Chat ID is required')
      .isMongoId()
      .withMessage('Invalid chat ID format'),
    body('content')
      .notEmpty()
      .withMessage('Message content is required')
      .isString()
      .withMessage('Message must be a string')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Message must be between 1 and 2000 characters')
  ],
  validateRequest,
  sendMessage
);

router.get('/request/:requestId', getChatByRequestId);

export default router;
