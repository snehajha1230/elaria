import mongoose from 'mongoose';
import Diary from '../models/Diary.js';

export const getDiaryEntries = async (req, res) => {
  try {
    const entries = await Diary.find({ userId: req.userId })
                              .sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching diary entries' });
  }
};

export const getPublicDiaryEntries = async (req, res) => {
  try {
    const friendId = req.params.friendId;
    
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'Invalid friend ID format' });
    }

    const entries = await Diary.find({ 
      userId: friendId,
      isPublic: true 
    }).sort({ createdAt: -1 });

    if (!entries || entries.length === 0) {
      return res.status(404).json({ message: 'No public diary entries found for this user' });
    }

    res.json(entries);
  } catch (err) {
    console.error('Error fetching public diary entries:', err);
    res.status(500).json({ message: 'Error fetching public diary entries' });
  }
};

export const createDiaryEntry = async (req, res) => {
  try {
    const entry = new Diary({ 
      content: req.body.content,
      userId: req.userId,
      isPublic: req.body.isPublic || false
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: 'Error creating diary entry' });
  }
};

export const deleteDiaryEntry = async (req, res) => {
  try {
    const entry = await Diary.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!entry) return res.status(404).json({ message: 'Diary entry not found' });
    res.json({ message: 'Diary entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting diary entry' });
  }
};
