import React, { useEffect, useState, useRef } from 'react';
import axios from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaHome } from 'react-icons/fa';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'https://elaria-server.onrender.com', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 10000
    });

    newSocket.on('connect', () => {
      setSocketConnected(true);
      const userId = localStorage.getItem('userId');
      if (userId) newSocket.emit('joinUserRoom', userId);
    });

    newSocket.on('disconnect', () => {
      setSocketConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleRequestUpdate = async (data) => {
      try {
        const res = await axios.get('/notifications');
        const updatedNotifications = res.data.data || [];
        
        // Ensure chatSession is properly included in notifications
        const enhancedNotifications = updatedNotifications.map(notification => {
          if (notification.type === 'accept' && data.chatSession?._id) {
            return {
              ...notification,
              chatSession: data.chatSession
            };
          }
          return notification;
        });
        
        setNotifications(enhancedNotifications);

        if (data.status === 'accepted' && data.chatSession?._id) {
          setActiveChats(prev => [...prev, data.chatSession._id]);
          toast.success(
            <div>
              <p>Chat request accepted by {data.helper?.name || 'helper'}!</p>
              <button 
                onClick={() => navigate(`/chat/${data.chatSession._id}`)}
                className="mt-2 text-sm bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-lg transition-all hover:scale-105"
              >
                Start Chat
              </button>
            </div>,
            {
              autoClose: 10000,
              closeButton: false
            }
          );
        } else if (data.status === 'declined') {
          toast.error('It seems the helper was unavailable at the moment and couldn’t accept your request. You’re welcome to try again shortly or reach out to someone else who’s available.');
        }
      } catch (err) {
        console.error('Failed to handle request update:', err);
      }
    };

    const handleNewMessage = (chat) => {
      const otherParticipant = chat.participants?.find(p => p._id !== localStorage.getItem('userId'));
      toast.info(`Check your chat requests, you might have a incoming request from ${otherParticipant?.name || 'user'}`, {
        onClick: () => handleOpenChat(chat._id)
      });
    };

    socket.on('requestUpdate', handleRequestUpdate);
    socket.on('newMessage', handleNewMessage);
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      toast.warn('Realtime updates may be delayed');
    });

    return () => {
      socket.off('requestUpdate', handleRequestUpdate);
      socket.off('newMessage', handleNewMessage);
      socket.off('connect_error');
    };
  }, [socket]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [activeChatsRes, notificationsRes] = await Promise.all([
          axios.get('/chat/active'),
          axios.get('/notifications')
        ]);
        
        setActiveChats(activeChatsRes.data?.data?.map(chat => chat._id) || []);
        setNotifications(notificationsRes.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Failed to load data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenChat = (chatId) => {
    if (!chatId) {
      toast.error('Invalid chat session');
      return;
    }

    // Emit join event for requester when they open chat
    if (socket) {
      socket.emit('joinChat', { chatId, userId: localStorage.getItem('userId') });
    }

    navigate(`/chat/${chatId}`);
  };

  const clearNotification = async (id) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to clear notification:', err);
      toast.error('Failed to update notification');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 dark:border-purple-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/30 dark:border-gray-700/50">
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
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 p-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white/20 p-2 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Your Notifications</h1>
              <p className="text-purple-100 dark:text-purple-200 text-sm">
                {notifications.length} unread {notifications.length === 1 ? 'message' : 'messages'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center bg-white/20 px-3 py-2 rounded-full">
            <span className={`w-3 h-3 rounded-full mr-2 ${socketConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className="text-sm text-white">
              {socketConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        {/* Notifications list */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-4 md:p-6 space-y-4" ref={notificationRef}>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-1">No notifications yet</h3>
              <p className="text-gray-400 dark:text-gray-500 max-w-md">
                When you receive chat requests or messages, they'll appear here. Stay tuned!
              </p>
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification._id}
                className={`p-5 rounded-xl border transition-all hover:shadow-md ${
                  notification.type === 'accept' 
                    ? 'border-green-200 bg-green-50/80 dark:border-green-800/50 dark:bg-green-900/20 hover:border-green-300' 
                    : notification.type === 'decline'
                      ? 'border-red-200 bg-red-50/80 dark:border-red-800/50 dark:bg-red-900/20 hover:border-red-300'
                      : 'border-blue-200 bg-blue-50/80 dark:border-blue-800/50 dark:bg-blue-900/20 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-4 ${
                      notification.type === 'accept' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                        : notification.type === 'decline'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {notification.type === 'accept' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : notification.type === 'decline' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => clearNotification(notification._id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-4 p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition"
                    aria-label="Dismiss notification"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {notification.type === 'accept' && (
                  <button
                    onClick={() => handleOpenChat(notification.chatId)}
                    className="mt-3 w-full py-2 text-sm bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg transition-all hover:shadow-md hover:scale-[1.01] flex items-center justify-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Start Chat Now</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
