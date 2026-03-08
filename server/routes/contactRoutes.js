import express from 'express';
import {
  addContact,
  getContacts,
  deleteContact,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addContact);
router.get('/', protect, getContacts);
router.delete('/:id', protect, deleteContact);

export default router;
