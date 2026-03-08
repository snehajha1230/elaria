import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiTrash2, FiHome, FiSun, FiMoon, FiSettings, FiX, FiMusic, FiEdit } from 'react-icons/fi';
import axios from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import rain from '../../assets/audio/rain.mp3';
import forest from '../../assets/audio/forest.mp3';
import piano from '../../assets/audio/piano.mp3';

const DiarySpace = () => {
  const { state } = useLocation();
  const viewOnly = state?.viewOnly || false;
  const friendId = state?.friendId;
  const navigate = useNavigate();
  
  // State for diary functionality
  const [entry, setEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for UI customization
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMusicOptions, setShowMusicOptions] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState('sunset');

  // Music options
   const musicOptions = [
      {
        name: 'Gentle Rain',
        url: rain
      },
      {
        name: 'Forest Ambience',
        url: forest
      },
      {
        name: 'Calm Piano',
        url: piano
      }
    ];

  // Theme definitions
  const themes = {
    sunset: {
      light: {
        bg: 'from-[#fff5f0] to-[#ffefe6]',
        card: 'bg-[#fff9f5]/90',
        border: 'border-orange-200',
        button: 'bg-gradient-to-r from-orange-500 to-pink-500',
        text: 'text-amber-900',
        secondaryText: 'text-amber-700',
        placeholder: 'placeholder-amber-300',
        focus: 'ring-orange-300',
        sidebar: 'bg-[#fdf1e9]',
        nav: 'bg-white/80',
        modal: 'bg-white',
        entryCard: 'bg-white hover:bg-pink-50',
        timeText: 'text-pink-600',
        writingArea: 'bg-[#fff9f5]'
      },
      dark: {
        bg: 'from-[#2a1a12] to-[#3a2218]',
        card: 'bg-[#1a120e]/90',
        border: 'border-orange-900',
        button: 'bg-gradient-to-r from-orange-600 to-pink-600',
        text: 'text-amber-100',
        secondaryText: 'text-amber-200',
        placeholder: 'placeholder-amber-700',
        focus: 'ring-orange-600',
        sidebar: 'bg-[#1a120e]',
        nav: 'bg-[#1a120e]/80',
        modal: 'bg-[#1a120e]',
        entryCard: 'bg-[#2a1a12] hover:bg-[#3a2218]',
        timeText: 'text-pink-300',
        writingArea: 'bg-[#1a120e]'
      }
    },
    forest: {
      light: {
        bg: 'from-[#f0f8f0] to-[#e6f3e6]',
        card: 'bg-[#f5f9f5]/90',
        border: 'border-emerald-200',
        button: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        text: 'text-emerald-900',
        secondaryText: 'text-emerald-700',
        placeholder: 'placeholder-emerald-300',
        focus: 'ring-emerald-300',
        sidebar: 'bg-[#e6f3e6]',
        nav: 'bg-white/80',
        modal: 'bg-white',
        entryCard: 'bg-white hover:bg-emerald-50',
        timeText: 'text-teal-600',
        writingArea: 'bg-[#f5f9f5]'
      },
      dark: {
        bg: 'from-[#0f1a10] to-[#142316]',
        card: 'bg-[#0c130d]/90',
        border: 'border-emerald-900',
        button: 'bg-gradient-to-r from-emerald-600 to-teal-600',
        text: 'text-emerald-100',
        secondaryText: 'text-emerald-200',
        placeholder: 'placeholder-emerald-700',
        focus: 'ring-emerald-600',
        sidebar: 'bg-[#0c130d]',
        nav: 'bg-[#0c130d]/80',
        modal: 'bg-[#0c130d]',
        entryCard: 'bg-[#142316] hover:bg-[#1a301d]',
        timeText: 'text-teal-300',
        writingArea: 'bg-[#0c130d]'
      }
    },
    ocean: {
      light: {
        bg: 'from-[#f0f5ff] to-[#e6efff]',
        card: 'bg-[#f5f9ff]/90',
        border: 'border-blue-200',
        button: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        text: 'text-blue-900',
        secondaryText: 'text-blue-700',
        placeholder: 'placeholder-blue-300',
        focus: 'ring-blue-300',
        sidebar: 'bg-[#e6efff]',
        nav: 'bg-white/80',
        modal: 'bg-white',
        entryCard: 'bg-white hover:bg-blue-50',
        timeText: 'text-indigo-600',
        writingArea: 'bg-[#f5f9ff]'
      },
      dark: {
        bg: 'from-[#0f1520] to-[#141d2e]',
        card: 'bg-[#0c101a]/90',
        border: 'border-blue-900',
        button: 'bg-gradient-to-r from-blue-600 to-indigo-600',
        text: 'text-blue-100',
        secondaryText: 'text-blue-200',
        placeholder: 'placeholder-blue-700',
        focus: 'ring-blue-600',
        sidebar: 'bg-[#0c101a]',
        nav: 'bg-[#0c101a]/80',
        modal: 'bg-[#0c101a]',
        entryCard: 'bg-[#141d2e] hover:bg-[#1a2540]',
        timeText: 'text-indigo-300',
        writingArea: 'bg-[#0c101a]'
      }
    }
  };

  const currentTheme = themes[theme][darkMode ? 'dark' : 'light'];

  // Fetch diary entries (only for user mode)
  const fetchEntries = async () => {
    if (viewOnly) {
      // For view mode, just simulate loading and show private message
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
      return;
    }

    // Original backend logic for user mode
    setIsLoading(true);
    try {
      const res = await axios.get('/diary', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const formattedEntries = res.data.map(entry => ({
        text: entry.content,
        time: new Date(entry.createdAt).toLocaleString(),
        _id: entry._id,
      }));
      setSavedEntries(formattedEntries);
    } catch (err) {
      console.error('Fetch entries error:', err.response?.data || err.message);
      toast.error('Failed to load your diary entries');
      setSavedEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new diary entry (only for user mode)
  const handleSave = async () => {
    if (entry.trim()) {
      try {
        const newEntry = {
          content: entry,
          isPublic: false
        };
        
        const res = await axios.post('/diary', newEntry);
        const savedEntry = res.data;
        const formatted = {
          text: savedEntry.content,
          time: new Date(savedEntry.createdAt).toLocaleString(),
          _id: savedEntry._id,
        };
        setSavedEntries([formatted, ...savedEntries]);
        setEntry('');
        toast.success('Diary entry saved successfully');
      } catch (err) {
        console.error('Error saving entry:', err);
        toast.error('Failed to save diary entry');
      }
    }
  };

  // Delete a diary entry (only for user mode)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/diary/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Diary entry deleted');
      setSavedEntries(savedEntries.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
      toast.error('Failed to delete diary entry');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Music controls
  const toggleMusic = (musicUrl) => {
    if (currentAudio && (currentAudio.src === musicUrl || currentAudio.src.includes(musicUrl))) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
    } else {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audio.play();
      setCurrentAudio(audio);
      setIsPlaying(true);
    }
    setShowMusicOptions(false);
  };

  const stopMusic = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  // Fetch entries on component mount
  useEffect(() => {
    fetchEntries();
    
    // Set dark mode based on system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, [viewOnly]);

  return (
    <div className={`relative min-h-screen w-full bg-gradient-to-br ${currentTheme.bg} transition-colors duration-500`}>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 ${currentTheme.nav} backdrop-blur-md z-50 border-b ${currentTheme.border} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-1"></div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${currentTheme.text}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </motion.button>
              
              {!viewOnly && (
                <>
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowSettings(!showSettings)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full ${currentTheme.text}`}
                      aria-label="Settings"
                    >
                      <FiSettings className="w-5 h-5" />
                    </motion.button>

                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${currentTheme.card} border ${currentTheme.border} z-50`}
                        >
                          <div className="py-1">
                            <div className={`px-4 py-2 text-sm font-medium border-b ${currentTheme.border} ${currentTheme.text}`}>
                              Theme Options
                            </div>
                            {Object.keys(themes).map((t) => (
                              <button
                                key={t}
                                onClick={() => {
                                  setTheme(t);
                                  setShowSettings(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                              >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative">
                    <motion.button
                      onClick={() => setShowMusicOptions(!showMusicOptions)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full ${currentTheme.text} ${isPlaying ? 'text-pink-500 dark:text-pink-400' : ''}`}
                      aria-label="Music"
                    >
                      <FiMusic className="w-5 h-5" />
                    </motion.button>

                    <AnimatePresence>
                      {showMusicOptions && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${currentTheme.card} border ${currentTheme.border} z-50`}
                        >
                          <div className="py-1">
                            <div className={`px-4 py-2 text-sm font-medium border-b ${currentTheme.border} ${currentTheme.text}`}>
                              Music Options
                            </div>
                            {musicOptions.map((music) => (
                              <button
                                key={music.name}
                                onClick={() => toggleMusic(music.url)}
                                className={`block w-full text-left px-4 py-2 text-sm ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                              >
                                {music.name}
                              </button>
                            ))}
                            <button
                              onClick={stopMusic}
                              className={`block w-full text-left px-4 py-2 text-sm ${currentTheme.text} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                            >
                              Stop Music
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}

              <motion.button
                onClick={() => navigate(viewOnly ? '/friendscommunity' : '/comfort-space')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${currentTheme.text}`}
                aria-label="Home"
              >
                <FiHome className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex h-[calc(100vh-6rem)]">
        {/* Sidebar for saved entries */}
        <motion.div 
          className={`hidden md:flex flex-col w-1/3 ${currentTheme.sidebar} p-6 border-r ${currentTheme.border} shadow-inner overflow-y-auto rounded-l-2xl`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`text-3xl font-bold mb-4 ${currentTheme.text}`}>
            {viewOnly ? "Friend's Letters" : "Your Letters"}
          </h2>
          
          {isLoading ? (
            <div className="flex flex-col space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`p-4 rounded-md ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'} animate-pulse`}>
                  <div className={`h-4 w-1/2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  <div className={`h-3 w-3/4 mt-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                </div>
              ))}
            </div>
          ) : viewOnly ? (
            <div className={`p-8 text-center ${currentTheme.text}`}>
              <h3 className="text-2xl font-bold mb-4">Letters are Private</h3>
              <p className={`${currentTheme.secondaryText}`}>
                The content of these letters is private and cannot be viewed.
              </p>
            </div>
          ) : savedEntries.length === 0 ? (
            <p className={`${currentTheme.secondaryText} italic`}>
              No letters saved yet
            </p>
          ) : (
            savedEntries.map((entry, idx) => (
              <motion.div
                key={entry._id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 mb-4 rounded-md shadow flex justify-between items-center cursor-pointer transition-all duration-200 ${currentTheme.entryCard} border ${currentTheme.border}`}
              >
                <div 
                  onClick={() => setSelectedEntry(entry)} 
                  className="flex-1"
                >
                  <h3 className={`font-bold ${currentTheme.timeText}`}>
                    {entry.time}
                  </h3>
                </div>
                {/* {!viewOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry._id);
                    }}
                    className={`ml-4 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <FiTrash2 size={18} />
                  </button>
                )} */}
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Main writing area */}
        <motion.div 
          className={`flex-1 flex flex-col items-center justify-start p-6 ${currentTheme.writingArea} overflow-y-auto rounded-r-2xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {!viewOnly ? (
            <motion.div 
              className={`rounded-2xl shadow-xl p-8 max-w-3xl w-full ${currentTheme.card} border ${currentTheme.border}`}
              whileHover={{ scale: 1.005 }}
            >
              <h1 className={`text-5xl text-center font-bold mb-6 ${currentTheme.text} font-['Caveat']`}>
                Dear Diary,
              </h1>
              <p className={`text-center mb-6 text-lg ${currentTheme.secondaryText}`}>
                This is your private space. Write freely and from the heart.
              </p>

              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your thoughts here..."
                className={`w-full h-64 p-5 text-xl ${darkMode ? 'bg-gray-900/30' : 'bg-white/90'} border ${currentTheme.border} rounded-xl shadow-inner resize-none focus:outline-none focus:ring-2 ${currentTheme.focus} font-['Caveat'] leading-relaxed ${currentTheme.text} ${currentTheme.placeholder}`}
              />

              <div className="text-center mt-6">
                <motion.button
                  onClick={handleSave}
                  disabled={!entry.trim()}
                  className={`${currentTheme.button} text-white px-8 py-3 text-lg rounded-full transition-all duration-300 shadow font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                  whileHover={entry.trim() ? { scale: 1.05 } : {}}
                  whileTap={entry.trim() ? { scale: 0.95 } : {}}
                >
                  Save Letter
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className={`rounded-2xl shadow-xl p-8 max-w-3xl w-full ${currentTheme.card} border ${currentTheme.border} text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className={`text-5xl font-bold mb-6 ${currentTheme.text} font-['Caveat']`}>
                Friend's Diary Space
              </h1>
              <p className={`text-lg mb-8 ${currentTheme.secondaryText}`}>
                Letters are private and cannot be viewed
              </p>
              
              <div className="flex justify-center">
                <img 
                  src="https://i.pinimg.com/736x/77/a0/a8/77a0a85d4deebcb0d90244788847e3a4.jpg" 
                  alt="No entries" 
                  className="w-48 opacity-70" 
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal Pop-up for Full Entry */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              className={`max-w-xl w-full mx-4 p-8 rounded-xl shadow-lg font-['Caveat'] relative ${currentTheme.modal} border ${currentTheme.border}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`text-xl font-bold mb-2 text-right ${currentTheme.timeText}`}>
                {selectedEntry.time}
              </h3>
              <p className={`text-[1.3rem] whitespace-pre-line leading-relaxed ${currentTheme.text}`}>
                {selectedEntry.text}
              </p>
              <button
                className={`absolute top-3 right-4 ${darkMode ? 'text-gray-400 hover:text-pink-300' : 'text-gray-500 hover:text-pink-600'} text-2xl`}
                onClick={() => setSelectedEntry(null)}
              >
                <FiX />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiarySpace;