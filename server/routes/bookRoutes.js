import express from 'express';
import Book from '../models/Book.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Add new book
router.post('/', verifyToken, async (req, res) => {
  const { title, author, genre, coverUrl, bookUrl, isPublic, progress } = req.body;
  
  if (!title || !coverUrl) {
    return res.status(400).json({ message: 'Title and Cover Image are required' });
  }

  try {
    const newBook = new Book({ 
      user: req.userId, 
      title, 
      author, 
      genre, 
      coverUrl,
      bookUrl,
      isPublic: isPublic !== undefined ? isPublic : true,
      progress: progress || 0
    });
    
    const saved = await newBook.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving book:', err);
    res.status(500).json({ 
      message: 'Server error while saving book',
      error: err.message
    });
  }
});

// Update book
router.put('/:id', verifyToken, async (req, res) => {
  const { title, author, genre, coverUrl, bookUrl, isPublic, progress } = req.body;
  
  if (!title || !coverUrl) {
    return res.status(400).json({ message: 'Title and Cover Image are required' });
  }

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { 
        title, 
        author, 
        genre, 
        coverUrl, 
        bookUrl,
        isPublic: isPublic !== undefined ? isPublic : true,
        progress: progress || 0
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found or not authorized' });
    }
    
    res.status(200).json(updatedBook);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ 
      message: 'Server error while updating book',
      error: err.message
    });
  }
});

// Get user's books
router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find({ user: req.userId })
                          .sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ 
      message: 'Server error while fetching books',
      error: err.message
    });
  }
});

// Get public books for a specific user
router.get('/public/:userId', async (req, res) => {
  try {
    const books = await Book.find({ 
      user: req.params.userId,
      isPublic: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json(books);
  } catch (err) {
    console.error('Error fetching public books:', err);
    res.status(500).json({ 
      message: 'Server error while fetching public books',
      error: err.message
    });
  }
});

// Delete book
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Book.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ 
      message: 'Server error while deleting book',
      error: err.message
    });
  }
});

export default router;