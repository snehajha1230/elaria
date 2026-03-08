import React, { useEffect, useState } from 'react';
import axios from '../../utils/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const moods = [
  { emoji: '😊', name: 'Happy', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { emoji: '😐', name: 'Neutral', color: 'bg-gray-100 dark:bg-gray-700' },
  { emoji: '😢', name: 'Sad', color: 'bg-blue-100 dark:bg-blue-900' },
  { emoji: '😡', name: 'Angry', color: 'bg-red-100 dark:bg-red-900' },
  { emoji: '😰', name: 'Anxious', color: 'bg-purple-100 dark:bg-purple-900' },
  { emoji: '🥱', name: 'Tired', color: 'bg-indigo-100 dark:bg-indigo-900' },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [latest, setLatest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchLatestMood = async () => {
    try {
      const res = await axios.get('/mood/latest');
      setLatest(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLatestMood();
  }, []);

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/mood', { mood: selectedMood.emoji, note });
      toast.success('Your mood has been recorded!');
      setSelectedMood(null);
      setNote('');
      fetchLatestMood();
    } catch (err) {
      toast.error('Failed to save mood');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 text-gray-800 dark:text-white">
              {/* Home Icon */}
              <motion.button
                onClick={() => navigate('/support')}
                whileHover={{ scale: 2 }}
                whileTap={{ scale: 1.2 }}
                className="absolute top-3 left-3 p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                aria-label="Home"
              >
                <FaHome className="text-xl" />
              </motion.button>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-600">
            Mood Journal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track your emotions and reflect on your day
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            How are you feeling today?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {moods.map((mood, idx) => (
              <motion.button
                key={idx}
                variants={itemVariants}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                  selectedMood?.emoji === mood.emoji
                    ? 'ring-2 ring-indigo-500 scale-105 ' + mood.color
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 ' + mood.color
                }`}
                onClick={() => setSelectedMood(mood)}
              >
                <span className="text-4xl mb-2">{mood.emoji}</span>
                <span className="text-sm font-medium">{mood.name}</span>
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: selectedMood ? 1 : 0.5 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add some notes (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's influencing your mood today?"
              className="w-full p-4 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              rows="3"
              disabled={!selectedMood}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-center"
          >
            <button
              onClick={handleSubmit}
              disabled={!selectedMood || isSubmitting}
              className={`px-8 py-3 rounded-full font-medium text-lg transition ${
                selectedMood
                  ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Record My Mood'
              )}
            </button>
          </motion.div>
        </motion.div>

        {latest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Recent Mood</h2>
              <div className="text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full">
                {new Date(latest.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-5xl bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
                {latest.mood}
              </div>
              <div className="flex-1">
                {latest.note ? (
                  <p className="text-gray-700 dark:text-gray-300 italic">"{latest.note}"</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No notes recorded</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(latest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;