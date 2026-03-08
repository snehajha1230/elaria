import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaStethoscope,
  FaUserFriends,
  FaHeartbeat,
  FaWind,
  FaExclamationTriangle,
  FaHandsHelping,
  FaUserCheck,
  FaLeaf,
  FaHeadset,
  FaChartLine,
  FaRegSmile,
  FaRegCalendarAlt,
  FaRegBell,
  FaHome,
  FaBookOpen,
  FaUsers,
  FaHeart,
  FaComments
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import BreathingModal from '../components/BreathingModal';
import SOSModal from '../components/SOSModal';
import axios from '../utils/api';
import { toast } from 'react-toastify';

const Support = () => {
  const navigate = useNavigate();
  const [showBreathing, setShowBreathing] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [activePath, setActivePath] = useState('discover');
  const [darkMode, setDarkMode] = useState(false);
  const [isHoveringSOS, setIsHoveringSOS] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSendSOS = async () => {
    try {
      await axios.post('/sos');
      toast.success('SOS alert sent to your emergency contacts!');
    } catch (err) {
      console.error('SOS Error:', err);
      toast.error('Failed to send SOS email');
    } finally {
      setShowSOS(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // Golden stars for background
  const stars = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    opacity: Math.random() * 0.7 + 0.3
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f0ff] to-[#d6e6ff] dark:from-[#0f172a] dark:to-[#1e293b] text-gray-800 dark:text-gray-100 overflow-hidden relative">
      {/* Golden Stars Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-[0_0_8px_1px_rgba(234,179,8,0.5)]"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [star.opacity, star.opacity * 0.5, star.opacity],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Organic Background Elements */}
        <motion.div 
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#d4e6f8]/40 to-[#e0f0ff]/40 dark:from-[#1e3a8a]/20 dark:to-[#1e40af]/20 opacity-30 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#ffdfd3]/40 to-[#ffebe6]/40 dark:from-[#5b21b6]/20 dark:to-[#7c3aed]/20 opacity-30 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Home Button with Enhanced Animation */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.9)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border border-[#e2e8f0] dark:border-[#334155] flex items-center justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaHome className="text-[#6b7bff] dark:text-[#a5b4fc] text-xl" />
          <motion.span 
            className="absolute left-full ml-2 px-2 py-1 bg-white dark:bg-[#1e293b] rounded-md text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none shadow-sm"
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            Return Home
          </motion.span>
        </motion.button>

        {/* Personalized Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#4a6bff] to-[#b47bff] dark:from-[#a5b4fc] dark:to-[#c4b5fd]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                className="text-lg text-[#6b7280] dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                How are you feeling today?
              </motion.p>
            </div>
            
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/notifications')}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/90 dark:bg-[#1e293b]/90 rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#334155] hover:shadow-md transition-all backdrop-blur-sm"
              >
                <div className="relative">
                  <FaRegBell className="text-[#6b7bff] dark:text-[#a5b4fc]" />
                  <motion.span 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span>Notifications</span>
              </motion.button>

              <motion.button
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/contacts')}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/90 dark:bg-[#1e293b]/90 rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#334155] hover:shadow-md transition-all backdrop-blur-sm"
              >
                <FaUserCheck className="text-[#ff7b7b] dark:text-[#fca5a5]" />
                <span>Emergency Contacts</span>
              </motion.button>
            </motion.div>
          </div>
          
          {/* Daily Wellness Tip - Enhanced Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#e2e8f0] dark:border-[#334155] mb-8 overflow-hidden relative"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#e0f0ff]/30 dark:bg-[#1e3a8a]/10 blur-xl"></div>
            <div className="flex items-start">
              <motion.div 
                className="bg-[#e0f0ff] dark:bg-[#1e3a8a]/30 p-3 rounded-xl mr-4 flex-shrink-0"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaRegCalendarAlt className="text-[#6b7bff] dark:text-[#93c5fd]" size={20} />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-[#4a6bff] dark:text-gray-200">Daily Wellness Tip</h3>
                <p className="text-[#6b7280] dark:text-gray-400">
                  When feeling overwhelmed, try the 5-4-3-2-1 grounding technique: Notice 5 things you can see, 
                  4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Wellness Tools - Enhanced Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <motion.h2 
              className="text-xl font-semibold mb-6 text-[#4a6bff] dark:text-gray-200"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Small Steps to Care for Yourself
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Breathe Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowBreathing(true)}
                  className="w-full h-full bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#334155] flex flex-col items-center justify-center hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#e0f2ff]/30 dark:bg-[#134e4a]/10 blur-xl"></div>
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-[#e0f2ff] dark:bg-[#134e4a]/30 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaWind className="text-[#6b7bff] dark:text-[#5eead4]" size={24} />
                  </motion.div>
                  <span className="font-medium">Breathe</span>
                  <span className="text-sm text-[#6b7280] dark:text-gray-400 mt-1">5 min exercise</span>
                </motion.button>
              </motion.div>
              
              {/* Self Check Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/diagnose-yourself')}
                  className="w-full h-full bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#334155] flex flex-col items-center justify-center hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#f0ffe8]/30 dark:bg-[#14532d]/10 blur-xl"></div>
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-[#f0ffe8] dark:bg-[#14532d]/30 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaLeaf className="text-[#7bc67b] dark:text-[#86efac]" size={24} />
                  </motion.div>
                  <span className="font-medium">Self Check</span>
                  <span className="text-sm text-[#6b7280] dark:text-gray-400 mt-1">Diagnose Yourself</span>
                </motion.button>
              </motion.div>
              
              {/* Gratitude Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/gratitude-journal')}
                  className="w-full h-full bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#334155] flex flex-col items-center justify-center hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#f8e8ff]/30 dark:bg-[#5b21b6]/10 blur-xl"></div>
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-[#f8e8ff] dark:bg-[#5b21b6]/30 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaBookOpen className="text-[#b47bff] dark:text-[#a78bfa]" size={24} />
                  </motion.div>
                  <span className="font-medium">Gratitude</span>
                  <span className="text-sm text-[#6b7280] dark:text-gray-400 mt-1">Daily Inspiration</span>
                </motion.button>
              </motion.div>
              
              {/* Mood Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/mood-tracker')}
                  className="w-full h-full bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-[#e2e8f0] dark:border-[#334155] flex flex-col items-center justify-center hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#e8f5ff]/30 dark:bg-[#3730a3]/10 blur-xl"></div>
                  <motion.div 
                    className="w-14 h-14 rounded-full bg-[#e8f5ff] dark:bg-[#3730a3]/30 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaHeartbeat className="text-[#6b7bff] dark:text-[#818cf8]" size={24} />
                  </motion.div>
                  <span className="font-medium">Mood</span>
                  <span className="text-sm text-[#6b7280] dark:text-gray-400 mt-1">Mood Journal</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced "You're Not Alone" Section with Three Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-[#e6f0ff] to-[#cce0ff] dark:from-[#1e293b] dark:to-[#0f172a] rounded-2xl p-8 shadow-2xl border-2 border-white/20 dark:border-[#334155]/50 mb-8 overflow-hidden relative"
        >
          {/* Golden star decorations */}
          <div className="absolute top-4 left-4 w-6 h-6 bg-yellow-300 rounded-full opacity-20 blur-sm"></div>
          <div className="absolute bottom-8 right-8 w-8 h-8 bg-yellow-400 rounded-full opacity-30 blur-sm"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Left side with information */}
              <div className="lg:w-1/2">
                <motion.h3 
                  className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4a6bff] to-[#b47bff] dark:from-[#a5b4fc] dark:to-[#c4b5fd]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  You're Not Alone
                </motion.h3>
                
                <motion.p 
                  className="text-lg text-[#4a5568] dark:text-gray-300 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Our community is here to support you through every step of your journey. 
                  Whether you need someone to talk to, professional guidance, or want to 
                  connect with others who understand, we're here for you.
                </motion.p>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="bg-white/80 dark:bg-[#1e293b]/80 p-4 rounded-lg border border-[#e2e8f0] dark:border-[#334155]">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                        <FaUsers className="text-blue-500 dark:text-blue-400" />
                      </div>
                      <span className="font-medium">Growing Together</span>
                    </div>
                    <p className="text-sm text-[#6b7280] dark:text-gray-400">
                      A kind, early community here for you.
                    </p>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-[#1e293b]/80 p-4 rounded-lg border border-[#e2e8f0] dark:border-[#334155]">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-3">
                        <FaHeart className="text-green-500 dark:text-green-400" />
                      </div>
                      <span className="font-medium">Positive First Impressions</span>
                    </div>
                    <p className="text-sm text-[#6b7280] dark:text-gray-400">
                      Users feel better after connecting.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Right side with three buttons */}
              <div className="lg:w-1/2 w-full">
                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  {/* Find Support Button */}
                  <motion.button
                    whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/helper-directory')}
                    className="p-4 bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-[#e2e8f0] dark:border-[#334155] flex items-center hover:bg-[#f5f7ff] dark:hover:bg-[#2d3748] transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                      <FaUserFriends className="text-blue-500 dark:text-blue-400 text-xl" />
                    </div>
                    <div>
                      <span className="font-medium block">Find Support</span>
                      <span className="text-sm text-[#6b7280] dark:text-gray-400">Connect with trained listeners</span>
                    </div>
                  </motion.button>
                  
                  {/* Become a Helper Button */}
                  <motion.button
                    whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/apply-helper')}
                    className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md flex items-center hover:from-blue-600 hover:to-indigo-700 transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <FaHandsHelping className="text-white text-xl" />
                    </div>
                    <div>
                      <span className="font-medium block">Become a Helper</span>
                      <span className="text-sm text-white/80">Share your experience to help others</span>
                    </div>
                  </motion.button>
                  
                  {/* Community Chat Button */}
                  <motion.button
                    whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/helper-dashboard')}
                    className="p-4 bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-[#e2e8f0] dark:border-[#334155] flex items-center hover:bg-[#f5f7ff] dark:hover:bg-[#2d3748] transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                      <FaComments className="text-purple-500 dark:text-purple-400 text-xl" />
                    </div>
                    <div>
                      <span className="font-medium block">Already a Helper?</span>
                      <span className="text-sm text-[#6b7280] dark:text-gray-400">Check Chat Requests</span>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Emergency Floating Button with Enhanced Animation */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.div
          animate={isHoveringSOS ? { scale: 1.2 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
          className="absolute inset-0 rounded-full bg-[#ff7b7b]/30 dark:bg-[#fca5a5]/20 blur-md"
          style={{ pointerEvents: 'none' }}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onHoverStart={() => setIsHoveringSOS(true)}
          onHoverEnd={() => setIsHoveringSOS(false)}
          onClick={() => setShowSOS(true)}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff7b7b] to-[#ff5252] shadow-lg hover:shadow-xl transition-all text-white flex items-center justify-center relative overflow-hidden border-2 border-white/20"
        >
          <motion.div
            animate={{ 
              scale: isHoveringSOS ? [1, 1.2, 1] : [1, 1.1, 1],
              opacity: isHoveringSOS ? [0.8, 1, 0.8] : [0.6, 0.8, 0.6]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 rounded-full bg-white/10"
          />
          <FaExclamationTriangle size={28} />
          <motion.span 
            className="absolute -bottom-8 left-0 right-0 text-xs font-bold text-center text-white opacity-0"
            animate={isHoveringSOS ? { y: -15, opacity: 1 } : { y: 0, opacity: 0 }}
          >
            EMERGENCY
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Modals with AnimatePresence */}
      <AnimatePresence>
        {showBreathing && (
          <BreathingModal onClose={() => setShowBreathing(false)} />
        )}
        {showSOS && (
          <SOSModal onConfirm={handleSendSOS} onCancel={() => setShowSOS(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Support;