// backend/controllers/moodController.js
import MoodEntry from '../models/MoodEntry.js';

export const addMood = async (req, res) => {
  try {
    const { mood, note } = req.body;
    const userId = req.userId;

    if (!mood || !userId) {
      return res.status(400).json({ error: 'Mood and user are required' });
    }

    const newMood = new MoodEntry({
      user: userId,
      mood,
      note,
    });

    await newMood.save();

    res.status(201).json(newMood);
  } catch (err) {
    console.error('Error saving mood:', err.message);
    res.status(500).json({ error: 'Failed to save mood' });
  }
};

export const getLatestMood = async (req, res) => {
  try {
    const userId = req.userId;

    const latest = await MoodEntry.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .exec();

    res.json(latest || {});
  } catch (err) {
    console.error('Error fetching mood:', err.message);
    res.status(500).json({ error: 'Failed to fetch mood' });
  }
};
