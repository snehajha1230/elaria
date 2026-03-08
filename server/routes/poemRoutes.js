import mongoose from 'mongoose';
import express from 'express';
import Poem from '../models/Poem.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// POST: Add poem (default isPublic to true like mediaRoutes)
router.post('/', verifyToken, async (req, res) => {
  const { title, author, linkUrl, content, isPublic } = req.body;
  
  // Validate that either linkUrl or content is provided
  if (!title || (!linkUrl && !content)) {
    return res.status(400).json({ message: 'Title and either link or content are required' });
  }

  try {
    const newPoem = new Poem({ 
      user: req.userId, 
      title, 
      author, 
      linkUrl: linkUrl || '', // Allow empty if content is provided
      content: content || '', // Allow empty if linkUrl is provided
      isPublic: isPublic !== undefined ? isPublic : true // Default to true like mediaRoutes
    });
    const saved = await newPoem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving poem:', err);
    res.status(500).json({ message: 'Server error while saving poem' });
  }
});

// PUT: Update poem
router.put('/:id', verifyToken, async (req, res) => {
  const { title, author, linkUrl, content, isPublic } = req.body;
  
  // Validate that either linkUrl or content is provided
  if (!title || (!linkUrl && !content)) {
    return res.status(400).json({ message: 'Title and either link or content are required' });
  }

  try {
    const updatedPoem = await Poem.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { 
        title, 
        author, 
        linkUrl: linkUrl || '',
        content: content || '',
        isPublic: isPublic !== undefined ? isPublic : true 
      },
      { new: true }
    );
    
    if (!updatedPoem) return res.status(404).json({ message: 'Poem not found' });
    res.json(updatedPoem);
  } catch (err) {
    console.error('Error updating poem:', err);
    res.status(500).json({ message: 'Server error while updating poem' });
  }
});

// GET: Fetch public poems for any user (no auth required)
router.get('/public/:userId', async (req, res) => {
  try {
    // Verify the user exists
    const userExists = await mongoose.model('User').exists({ _id: req.params.userId });
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const poems = await Poem.find({ 
      user: req.params.userId,
      isPublic: true 
    }).sort({ createdAt: -1 });

    res.status(200).json(poems);
  } catch (err) {
    console.error('Error fetching public poems:', err);
    res.status(500).json({ 
      message: 'Error fetching public poems',
      error: err.message 
    });
  }
});

// GET: Fetch poems for authenticated user (requires auth)
router.get('/', verifyToken, async (req, res) => {
  try {
    const poems = await Poem.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(poems);
  } catch (err) {
    console.error('Error fetching poems:', err);
    res.status(500).json({ message: 'Error fetching poems' });
  }
});

// DELETE: Remove poem
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Poem.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Poem not found' });
    res.status(200).json({ message: 'Poem deleted successfully' });
  } catch (err) {
    console.error('Error deleting poem:', err);
    res.status(500).json({ message: 'Error deleting poem' });
  }
});

export default router;