import React, { useEffect, useState } from 'react';
import axios from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome } from 'react-icons/fa';


const HelperDirectory = () => {
  const [helpers, setHelpers] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [helpersRes, activeChatsRes] = await Promise.all([
          axios.get('/helpers/directory'),
          axios.get('/chat/active')
        ]);
        
        setHelpers(helpersRes.data || []);
        setActiveChats(activeChatsRes.data?.data?.map(chat => chat._id) || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Failed to load data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const requestChat = async () => {
    if (!selectedHelper) return;
    
    try {
      const response = await axios.post('/chat/request', {
        helperId: selectedHelper._id
      });
      
      toast.success('Chat request sent successfully!');
      setShowRequestModal(false);
      
      // If the chat is immediately created, navigate to it
      if (response.data?.chatId) {
        navigate(`/chat/${response.data.chatId}`);
      }
    } catch (err) {
      console.error('Failed to request chat:', err);
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleOpenChat = (chatId) => {
    if (!chatId) {
      toast.error('Invalid chat session');
      return;
    }
    navigate(`/chat/${chatId}`);
  };

  // Filter helpers based on search and availability
  const filteredHelpers = helpers.filter(helper => {
    const matchesSearch = helper.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         helper.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = filterAvailability === 'all' || 
                              (filterAvailability === 'available' && helper.available);
    
    return matchesSearch && matchesAvailability;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "linear"
          }}
          className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-blue-200"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="container mx-auto px-4 py-8">
         <div className="absolute top-4 left-4">
                                {/* Home Icon */}
                                      <motion.button
                                        onClick={() => navigate('/support')}
                                        whileHover={{ scale: 2 }}
                                        whileTap={{ scale: 1.2 }}
                                        className="absolute top-0 left-0 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        aria-label="Home"
                                      >
                                        <FaHome className="text-xl" />
                                      </motion.button>
                </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Connect with Helpers
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            These compassionate listeners are here to support you. Reach out safely and anonymously.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white dark:bg-gray-700 rounded-xl shadow-md p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search helpers by name or bio..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
              <select
                className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
              >
                <option value="all">All Helpers</option>
                <option value="available">Available Now</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Helpers Grid */}
        {filteredHelpers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredHelpers.map((helper) => (
              <motion.div
                key={helper._id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                        {helper.user?.name?.charAt(0) || 'H'}
                      </div>
                      <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white dark:border-gray-700 ${
                        helper.available ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {helper.user?.name || 'Anonymous'}
                      </h2>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {helper.role || 'Trained Listener'}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {helper.bio || 'Compassionate listener ready to support you.'}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {helper.specialties?.slice(0, 3).map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-5 flex flex-col space-y-2">
                  {/* <button
                    onClick={() => navigate(`/helper/${helper._id}`)}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg text-sm font-medium transition"
                  >
                    View Profile
                  </button> */}
                  {helper.available && (
                    <button
                      onClick={() => {
                        if (activeChats.some(id => id === helper._id)) {
                          handleOpenChat(helper._id);
                        } else {
                          setSelectedHelper(helper);
                          setShowRequestModal(true);
                        }
                      }}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition ${
                        activeChats.some(id => id === helper._id)
                          ? 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-800 dark:text-green-200'
                          : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white'
                      }`}
                    >
                      {activeChats.some(id => id === helper._id) ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          Continue Chat
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                          Request Chat
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-8 text-center"
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No helpers found
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? "Try adjusting your search or filter criteria."
                : "All helpers are currently unavailable. Please check back later."}
            </p>
          </motion.div>
        )}
      </div>

      {/* Request Chat Modal */}
      <AnimatePresence>
        {showRequestModal && selectedHelper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center text-white text-xl font-bold mr-4">
                    {selectedHelper.user?.name?.charAt(0) || 'H'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Request Chat with {selectedHelper.user?.name || 'Helper'}
                  </h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">About this helper</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedHelper.bio || 'Compassionate listener ready to support you.'}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">What to expect</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc pl-5">
                      <li>Anonymous and confidential</li>
                      <li>Non-judgmental support</li>
                      <li>Safe space to share</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={requestChat}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg shadow-md transition"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelperDirectory;