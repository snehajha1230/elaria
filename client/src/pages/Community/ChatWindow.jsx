// ChatWindow.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/api';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

// Loading spinner component
const LoadingSpinner = ({ fullScreen = true }) => (
  <div className={`flex items-center justify-center ${fullScreen ? 'h-screen' : 'h-full'}`}>
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error display component
const ErrorDisplay = ({ message, onRetry, onHome }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-6 max-w-md">
        <div className="text-red-500 text-lg mb-4">{message || 'An error occurred'}</div>
        <div className="flex justify-center space-x-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          )}
          <button
            onClick={onHome || (() => navigate('/'))}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatWindow = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatSession, setChatSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const socketUrl = (import.meta.env.VITE_API_BASE_URL || 'https://elaria-server.onrender.com').replace(/\/$/, '');
    const newSocket = io(socketUrl, {
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      autoConnect: true,
      withCredentials: true,
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      if (chatId) {
        newSocket.emit('joinChat', { chatId });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      toast.warn('Connection lost. Reconnecting...');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      toast.error(`Connection error: ${err.message}`);
    });

    newSocket.on('newMessage', (data) => {
      console.log('Received message:', data);
      if (data.chatId === chatId) {
        const userId = localStorage.getItem('userId');

        setMessages(prev => {
          const isDuplicate = prev.some(m =>
            m._id === data.message._id ||
            (m.isTemp &&
              m.content === data.message.content &&
              m.sender._id === data.message.sender._id)
          );

          if (isDuplicate) {
            return prev.map(m =>
              m.isTemp &&
              m.content === data.message.content &&
              m.sender._id === data.message.sender._id
                ? { ...data.message, isOwn: data.message.sender._id === userId }
                : m
            );
          }

          return [...prev, {
            ...data.message,
            isOwn: data.message.sender._id === userId
          }];
        });
      }
    });

    newSocket.on('userTyping', (data) => {
      if (data.chatId === chatId && data.userId !== localStorage.getItem('userId')) {
        setTypingUser(data.userName);
        setIsTyping(true);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setTypingUser(null);
        }, 2000);
      }
    });

    setSocket(newSocket);

    return () => {
      if (chatId && newSocket.connected) {
        newSocket.emit('leaveChat', chatId);
      }
      newSocket.off('newMessage');
      newSocket.off('userTyping');
      newSocket.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [chatId]);

  const fetchChatSession = useCallback(async () => {
    if (!chatId) {
      setError('Invalid chat session');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`/chat/${chatId}`);
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || 'Invalid chat data');
      }

      const currentUserId = localStorage.getItem('userId');
      const formattedMessages = res.data.data.messages?.map(msg => ({
        ...msg,
        isOwn: msg.sender._id === currentUserId
      })) || [];

      setChatSession(res.data.data);
      setMessages(formattedMessages);

    } catch (err) {
      console.error('Failed to fetch chat:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load chat');
      toast.error(err.response?.data?.message || 'Failed to load chat session');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const handleTyping = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('typing', {
        chatId,
        userId: localStorage.getItem('userId'),
        userName: 'You'
      });
    }
  }, [socket, isConnected, chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !isConnected) return;

    const tempId = `temp-${Date.now()}`;
    const currentUserId = localStorage.getItem('userId');
    const tempMessage = {
      _id: tempId,
      content: newMessage,
      sender: { _id: currentUserId, name: 'You' },
      timestamp: new Date(),
      isOwn: true,
      isTemp: true
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const res = await axios.post(`/chat/${chatId}/messages`, {
        content: newMessage,
        sender: currentUserId
      });

      setMessages(prev => prev.map(m =>
        m._id === tempId ? { ...res.data.data, isOwn: true } : m
      ));
    } catch (err) {
      setMessages(prev => prev.filter(m => m._id !== tempId));
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetchChatSession();
  }, [fetchChatSession]);

  if (!chatId) return <ErrorDisplay message="Invalid chat session" onRetry={() => navigate('/')} />;
  if (loading) return <LoadingSpinner fullScreen />;
  if (error || !chatSession) {
    return (
      <ErrorDisplay
        message={error || 'Chat session not found'}
        onRetry={() => window.location.reload()}
        onHome={() => navigate('/')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {chatSession.participants
                .filter(p => p._id !== localStorage.getItem('userId'))
                .map(p => p.name)
                .join(' and ')}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center" title={isConnected ? 'Connected' : 'Disconnected'}>
              <span className={`w-3 h-3 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs">{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
        {isTyping && typingUser && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {typingUser} is typing...
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                  message.isOwn
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                {!message.isOwn && (
                  <div className="font-semibold mb-1">
                    {message.sender?.name || 'Unknown'}
                  </div>
                )}
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <div className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            className="flex-1 p-2 rounded-l-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!isConnected}
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
