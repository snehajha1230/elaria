import React, { useEffect, useState } from 'react';
import axios from '../../utils/api';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMessageSquare, FiUser, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { RiChatNewLine } from 'react-icons/ri';
import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HelperDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('/chat/requests');
        setRequests(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch requests:', err);
        toast.error('No Chat Requests Found');
      }
    };

    const newSocket = io('https://elaria-server.onrender.com', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    setSocket(newSocket);

    const userId = localStorage.getItem('userId');
    if (userId) {
      newSocket.emit('joinUserRoom', userId);
    }

    newSocket.on('newRequest', (request) => {
      setRequests(prev => [request, ...prev]);
      toast.info(
        <div className="flex items-center">
          <RiChatNewLine className="mr-2 text-blue-500" size={20} />
          <span>New chat request from <strong>{request.requester?.name}</strong></span>
        </div>
      );
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      toast.warn('Realtime updates may be delayed');
    });

    fetchRequests();

    return () => {
      newSocket.off('newRequest');
      newSocket.off('connect_error');
      newSocket.disconnect();
    };
  }, []);

  const handleRespond = async (requestId, accept) => {
    setLoadingStates(prev => ({ ...prev, [requestId]: true }));
    
    try {
      const response = await axios.post('/chat/respond', { 
        requestId, 
        response: accept ? 'accept' : 'decline' 
      });

      if (accept) {
        setRequests(prev => prev.map(req => 
          req._id === requestId 
            ? { ...req, status: 'accepted', chatSession: response.data.data?.chatSession }
            : req
        ));
        toast.success(
          <div className="flex items-center">
            <FiCheck className="mr-2 text-green-500" size={20} />
            <span>Request accepted! Click "Start Chat" to begin.</span>
          </div>
        );
      } else {
        setRequests(prev => prev.filter(req => req._id !== requestId));
        toast.success(
          <div className="flex items-center">
            <FiX className="mr-2 text-red-500" size={20} />
            <span>Request declined</span>
          </div>
        );
      }
    } catch (err) {
      console.error('Failed to respond:', err);
      toast.error(err.response?.data?.message || 'Failed to process response');
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  });

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <FiMessageSquare className="mr-3 text-blue-500" size={28} />
              Chat Requests Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage incoming chat requests and help those in need
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
            {['all', 'pending', 'accepted'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== 'all' && (
                  <span className="ml-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                    {requests.filter(r => r.status === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full inline-block mb-4">
                <FiMessageSquare className="text-blue-500 dark:text-blue-400" size={32} />
              </div>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                No {activeTab === 'all' ? '' : activeTab} chat requests
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === 'all'
                  ? "You don't have any chat requests yet. New requests will appear here automatically."
                  : `You don't have any ${activeTab} requests at the moment.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {filteredRequests.map(request => (
              <div 
                key={request._id} 
                className={`p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all hover:shadow-lg border-l-4 ${
                  request.status === 'pending' 
                    ? 'border-yellow-500'
                    : request.status === 'accepted'
                      ? 'border-green-500'
                      : 'border-red-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <FiUser className="text-blue-500 dark:text-blue-400" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {request.requester?.name || 'Anonymous User'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <FiClock className="mr-1" size={14} />
                        {new Date(request.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    request.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                      : request.status === 'accepted' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="mt-5 flex space-x-3">
                  {request.status === 'accepted' ? (
                    <button
                      onClick={() => navigate(`/chat/${request.chatSession._id}`)}
                      className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all hover:shadow-md"
                    >
                      <FiMessageSquare className="mr-2" size={16} />
                      Start Chat
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRespond(request._id, true)}
                        disabled={loadingStates[request._id]}
                        className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg transition-all ${
                          loadingStates[request._id] 
                            ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-md'
                        }`}
                      >
                        {loadingStates[request._id] ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FiCheck className="mr-2" size={16} />
                            Accept
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRespond(request._id, false)}
                        disabled={loadingStates[request._id]}
                        className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg transition-all ${
                          loadingStates[request._id] 
                            ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-md'
                        }`}
                      >
                        <FiX className="mr-2" size={16} />
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HelperDashboard;
