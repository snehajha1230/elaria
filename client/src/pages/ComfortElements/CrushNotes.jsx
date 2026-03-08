import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiSun, FiMoon, FiSettings, FiMusic } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import rain from '../../assets/audio/rain.mp3';
import forest from '../../assets/audio/forest.mp3';
import piano from '../../assets/audio/piano.mp3';

const CrushNotes = () => {
  const [note, setNote] = useState('');
  const [crushed, setCrushed] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [theme, setTheme] = useState('sunset');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMusicOptions, setShowMusicOptions] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check user's preferred color scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

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
        crushed: 'text-amber-600',
        nav: 'bg-white/80'
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
        crushed: 'text-amber-400',
        nav: 'bg-[#1a120e]/80'
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
        crushed: 'text-emerald-600',
        nav: 'bg-white/80'
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
        crushed: 'text-emerald-400',
        nav: 'bg-[#0c130d]/80'
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
        crushed: 'text-blue-600',
        nav: 'bg-white/80'
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
        crushed: 'text-blue-400',
        nav: 'bg-[#0c101a]/80'
      }
    }
  };

  const currentTheme = themes[theme][darkMode ? 'dark' : 'light'];

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

  const handleCrush = () => {
    if (note.trim()) {
      setCrushed(true);
      setTimeout(() => {
        setNote('');
        setCrushed(false);
      }, 2000);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMusic = (musicUrl) => {
    if (currentAudio && (currentAudio.src === musicUrl || currentAudio.src.includes(musicUrl))) {
      // Toggle play/pause if same music is selected
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
    } else {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      // Create new audio and play
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

  useEffect(() => {
    return () => {
      // Clean up audio when component unmounts
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  return (
    <div className={`relative min-h-screen w-full bg-gradient-to-br ${currentTheme.bg} transition-colors duration-500`}>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 ${currentTheme.nav} backdrop-blur-md z-50 border-b ${currentTheme.border} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-1"></div> {/* Empty div for balance */}
            
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
                  className={`p-2 rounded-full ${currentTheme.text} ${isPlaying ? 'text-pink-500' : ''}`}
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

              <motion.button
                onClick={() => navigate('/comfort-space')}
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
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Floating leaves/particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute text-xl ${i % 3 === 0 ? 'text-orange-300' : i % 2 === 0 ? 'text-amber-200' : 'text-pink-200'}`}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotate: Math.random() * 360
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                rotate: [0, Math.random() * 60 - 30],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            >
              {i % 3 === 0 ? '✿' : i % 2 === 0 ? '❀' : '❁'}
            </motion.div>
          ))}
        </div>

        <motion.div 
          className={`w-full max-w-4xl mx-auto ${currentTheme.card} rounded-3xl shadow-lg backdrop-blur-sm p-8 md:p-12 border ${currentTheme.border} transition-all duration-300 ${isWriting ? 'scale-[1.01]' : ''}`}
          whileHover={{ scale: 1.005 }}
        >
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className={`text-4xl md:text-5xl font-medium ${currentTheme.text} mb-4`}>
              Your Personal Release Space
            </h1>
            <p className={`text-xl ${currentTheme.secondaryText}`}>
              {isWriting 
                ? "Keep going, we're listening..." 
                : "What's on your mind today?"}
            </p>
          </motion.div>

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {!crushed ? (
                <motion.div
                  key="note"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.textarea
                    className={`w-full h-80 p-6 text-lg rounded-xl border ${currentTheme.border} resize-none focus:outline-none focus:ring-2 ${currentTheme.focus} ${darkMode ? 'bg-gray-900/30' : 'bg-white/70'} ${currentTheme.placeholder} transition-all duration-200 ${currentTheme.text}`}
                    placeholder="Write freely... this is just for you"
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                      setIsWriting(e.target.value.length > 0);
                    }}
                    onFocus={() => setIsWriting(true)}
                    onBlur={() => setIsWriting(note.length > 0)}
                  />
                  <motion.div 
                    className={`text-right mt-2 text-sm ${currentTheme.secondaryText}`}
                    animate={{ opacity: note.length > 0 ? 1 : 0.5 }}
                  >
                    {note.length}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="crushed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-80"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      ease: "backInOut"
                    }}
                    className="text-6xl mb-4"
                  >
                    {darkMode ? '✨' : '🌿'}
                  </motion.div>
                  <motion.p 
                    className={`text-xl font-medium ${currentTheme.crushed}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Released with care
                  </motion.p>
                  <motion.p 
                    className={`mt-2 ${currentTheme.secondaryText}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Take a deep breath
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div 
            className="mt-10 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handleCrush}
              disabled={note.trim().length === 0}
              className={`${currentTheme.button} text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              whileHover={note.trim().length > 0 ? { scale: 1.05 } : {}}
              whileTap={note.trim().length > 0 ? { scale: 0.95 } : {}}
            >
              {note.trim().length === 0 ? 'Write something first' : 'Release It'}
            </motion.button>
          </motion.div>

          <motion.div 
            className={`mt-8 text-sm ${currentTheme.secondaryText} text-center`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 1 }}
          >
            Your words disappear forever when released
          </motion.div>
        </motion.div>

        {/* Personal touch - signature */}
        <motion.div 
          className={`absolute bottom-4 left-0 right-0 text-center ${currentTheme.secondaryText} text-sm`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.5 }}
        >
          Made with care
        </motion.div>
      </div>
    </div>
  );
};

export default CrushNotes;