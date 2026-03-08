// components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 group"
        >
          <div className="p-2 rounded-lg bg-amber-900/30 group-hover:bg-amber-900/50 transition">
            <HomeIcon className="w-5 h-5 text-amber-400" />
          </div>
          <span className="font-serif text-xl font-bold text-amber-400 hidden sm:block">Elaria</span>
        </motion.button>

        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 rounded-full bg-gray-800 transition shadow-sm"
          >
            <span className="text-sm md:text-md font-medium">
              Welcome home, {user?.name ? `${user.name.split(' ')[0]}` : 'friend'} <span className="text-amber-400">✧</span>
            </span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span className="text-rose-500 font-medium hidden sm:inline">Sign out</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;