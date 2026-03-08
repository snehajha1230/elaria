import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserPlus, FaUserCheck, FaUserClock, FaHome,
  FaSearch, FaArrowLeft, FaCheck, FaTimes, FaSpinner,
  FaUserFriends, FaUserAlt, FaEllipsisH
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Friends = ({ darkMode }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState({
    users: false,
    requests: false,
    friends: false,
    actions: false
  });

  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [visitingFriend, setVisitingFriend] = useState(null); // Track which friend we're visiting

  // Fetch data on tab change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, [activeTab]: true }));

        if (activeTab === 'discover') {
          const res = await api.get('/friends/users', {
            params: { search: searchQuery }
          });
          setUsers(res.data);
        } else if (activeTab === 'requests') {
          const res = await api.get('/friends/requests');
          setIncomingRequests(res.data.incoming);
          setOutgoingRequests(res.data.outgoing);
        } else if (activeTab === 'friends') {
          const res = await api.get('/friends');
          setFriends(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, [activeTab]: false }));
      }
    };

    fetchData();
  }, [activeTab, searchQuery]);

  // Handle sending friend request
  const handleSendRequest = async (userId) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await api.post(`/friends/requests/${userId}`);
      const updated = users.map(u =>
        u._id === userId ? { ...u, status: 'pending' } : u
      );
      setUsers(updated);
    } catch (err) {
      console.error('Send request failed', err);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Handle canceling friend request
  const handleCancelRequest = async (requestId, userId) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await api.delete(`/friends/requests/${requestId}`);
      setOutgoingRequests(outgoingRequests.filter(r => r._id !== requestId));
      setUsers(users.map(u => u._id === userId ? { ...u, status: 'none' } : u));
    } catch (err) {
      console.error('Cancel request failed', err);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Handle accepting friend request
  const handleAcceptRequest = async (requestId) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await api.put(`/friends/requests/${requestId}`, { action: 'accept' });
      setIncomingRequests(incomingRequests.filter(r => r._id !== requestId));
      const res = await api.get('/friends');
      setFriends(res.data);
    } catch (err) {
      console.error('Accept request failed', err);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Handle rejecting friend request
  const handleRejectRequest = async (requestId) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await api.put(`/friends/requests/${requestId}`, { action: 'reject' });
      setIncomingRequests(incomingRequests.filter(r => r._id !== requestId));
    } catch (err) {
      console.error('Reject request failed', err);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Handle removing friend
  const handleRemoveFriend = async (friendId) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await api.delete(`/friends/${friendId}`);
      setFriends(friends.filter(f => f._id !== friendId));
    } catch (err) {
      console.error('Remove friend failed', err);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Handle visiting friend's home (only shows public rooms)
  const handleVisitFriend = async (friendId, friendName) => {
    try {
      setVisitingFriend({ id: friendId, name: friendName });
      setLoading(prev => ({ ...prev, actions: true }));
      
      // First check if friend has any public rooms
      const res = await api.get(`/rooms/friends/${friendId}/rooms`);
      
      if (res.data.length === 0) {
        alert(`${friendName} hasn't made any rooms public yet`);
        return;
      }

      // Navigate to friend's home in view-only mode
      navigate(`/friend-home/${friendId}`, { 
        state: { 
          viewOnly: true,
          friendId,
          friendName,
          publicRooms: res.data
        }
      });
    } catch (err) {
      console.error('Failed to visit friend:', err);
      alert('Failed to load friend home. Please try again.');
    } finally {
      setVisitingFriend(null);
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Render loading spinner
  const renderLoader = () => (
    <div className="flex justify-center items-center py-6">
      <FaSpinner className="animate-spin text-xl" />
    </div>
  );

  // Beautiful loading screen for visiting friend's home
  const renderFriendHomeLoading = () => (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
      darkMode ? 'bg-[#2a211c]' : 'bg-[#f5f5f5]'
    }`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`p-8 rounded-2xl shadow-xl ${
          darkMode ? 'bg-[#3a312c]' : 'bg-white'
        } max-w-md w-full mx-4`}
      >
        <div className="text-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
            className={`text-6xl mb-6 ${darkMode ? 'text-[#b38a6d]' : 'text-[#8c6a56]'}`}
          >
            
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">
            Taking you to {visitingFriend?.name}'s home
          </h2>
          
          <p className={`mb-6 ${darkMode ? 'text-[#d9c7b8]' : 'text-gray-600'}`}>
            Getting things ready for your visit… almost there
          </p>
          
          <div className="relative h-2 w-full rounded-full overflow-hidden bg-gray-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`absolute top-0 left-0 h-full ${
                darkMode ? 'bg-[#b38a6d]' : 'bg-[#8c6a56]'
              }`}
            />
          </div>
          
          {/* <div className="mt-6 flex justify-center space-x-2">
            {["📚", "☕", "🎵", "🖼️", "🛋️"].map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ y: 0, opacity: 0.6 }}
                animate={{ y: [0, -5, 0], opacity: [0.6, 1, 0.6] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.2
                }}
                className="text-2xl"
              >
                {emoji}
              </motion.span>
            ))}
          </div> */}
        </div>
      </motion.div>
    </div>
  );

  // Render user card component
  const renderUserCard = (user, extraActions = null, isFriend = false) => (
    <motion.div
      key={user._id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        darkMode ? 'bg-[#3a312c] border-[#4a413c]' : 'bg-white border-gray-200'
      } border`}
    >
      <div className="p-5">
        <div className="flex items-center space-x-4">
          <div className={`relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${
            darkMode ? 'bg-[#b38a6d] text-[#2a211c]' : 'bg-[#8c6a56] text-white'
          }`}>
            {user.name.split(' ').map(n => n[0]).join('')}
            {isFriend && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <FaUserCheck className="text-xs text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold truncate ${
              darkMode ? 'text-[#f8e3d4]' : 'text-[#5a4a42]'
            }`}>
              {user.name}
            </h3>
            <p className={`text-sm truncate ${
              darkMode ? 'text-[#d9c7b8]' : 'text-[#7a6a62]'
            }`}>
              @{user.username}
            </p>
          </div>
        </div>
        
        {extraActions && (
          <div className="mt-4 flex justify-between space-x-2">
            {extraActions}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      {loading.actions && visitingFriend && renderFriendHomeLoading()}
      
      <div className={`min-h-screen ${darkMode ? 'bg-[#2a211c] text-[#f8e3d4]' : 'bg-[#f5f5f5] text-[#5a4a42]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with navigation */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <button 
                onClick={() => navigate('/comfort-space')} 
                className={`p-2 rounded-full mr-4 transition-colors ${
                  darkMode ? 'bg-[#3a312c] hover:bg-[#4a413c]' : 'bg-white hover:bg-gray-100'
                } shadow-sm`}
              >
                <FaHome />
              </button>
              <h1 className="text-3xl font-bold">Friends</h1>
            </div>
            
            {/* Search bar (only visible in discover tab) */}
            {activeTab === 'discover' && (
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search people..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-[#3a312c] text-[#f8e3d4] placeholder-[#7a6a62] focus:ring-[#b38a6d]' 
                      : 'bg-white text-[#5a4a42] placeholder-[#9a8a82] focus:ring-[#8c6a56]'
                  } shadow-sm`}
                />
              </div>
            )}
          </div>

          {/* Main content area with sidebar and cards */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar navigation */}
            <div className={`w-full lg:w-64 p-4 rounded-xl ${
              darkMode ? 'bg-[#3a312c]' : 'bg-white'
            } shadow-sm`}>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'friends'
                      ? darkMode 
                        ? 'bg-[#b38a6d] text-[#2a211c]' 
                        : 'bg-[#8c6a56] text-white'
                      : darkMode 
                        ? 'hover:bg-[#4a413c]' 
                        : 'hover:bg-gray-100'
                  }`}
                >
                  <FaUserFriends className="text-lg" />
                  <span>My Friends</span>
                  {friends.length > 0 && (
                    <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                      darkMode ? 'bg-[#2a211c] text-[#b38a6d]' : 'bg-[#f8e3d4] text-[#8c6a56]'
                    }`}>
                      {friends.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'discover'
                      ? darkMode 
                        ? 'bg-[#b38a6d] text-[#2a211c]' 
                        : 'bg-[#8c6a56] text-white'
                      : darkMode 
                        ? 'hover:bg-[#4a413c]' 
                        : 'hover:bg-gray-100'
                  }`}
                >
                  <FaUserPlus className="text-lg" />
                  <span>Discover People</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'requests'
                      ? darkMode 
                        ? 'bg-[#b38a6d] text-[#2a211c]' 
                        : 'bg-[#8c6a56] text-white'
                      : darkMode 
                        ? 'hover:bg-[#4a413c]' 
                        : 'hover:bg-gray-100'
                  }`}
                >
                  <FaUserClock className="text-lg" />
                  <span>Friend Requests</span>
                  {(incomingRequests.length > 0 || outgoingRequests.length > 0) && (
                    <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                      darkMode ? 'bg-[#2a211c] text-[#b38a6d]' : 'bg-[#f8e3d4] text-[#8c6a56]'
                    }`}>
                      {incomingRequests.length + outgoingRequests.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1">
              {loading[activeTab] ? renderLoader() : (
                <>
                  {/* Friends tab */}
                  {activeTab === 'friends' && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Your Friends ({friends.length})</h2>
                      {friends.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {friends.map(friend =>
                            renderUserCard(friend, (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleVisitFriend(friend._id, friend.name)}
                                  disabled={loading.actions}
                                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg ${
                                    darkMode 
                                      ? 'bg-[#b38a6d] hover:bg-[#c49a7d] text-[#2a211c]' 
                                      : 'bg-[#8c6a56] hover:bg-[#9d7b66] text-white'
                                  } transition-colors disabled:opacity-50`}
                                >
                                  {loading.actions ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    <>
                                      <FaHome />
                                      <span>View Home</span>
                                    </>
                                  )}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleRemoveFriend(friend._id)}
                                  disabled={loading.actions}
                                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg ${
                                    darkMode 
                                      ? 'bg-[#4a413c] hover:bg-[#5a514c] text-[#f8e3d4]' 
                                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                  } transition-colors disabled:opacity-50`}
                                >
                                  {loading.actions ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    <>
                                      <FaTimes />
                                      <span>Remove</span>
                                    </>
                                  )}
                                </motion.button>
                              </>
                            ), true)
                          )}
                        </div>
                      ) : (
                        <div className={`p-8 rounded-xl text-center ${
                          darkMode ? 'bg-[#3a312c]' : 'bg-white'
                        } shadow-sm`}>
                          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-200 text-gray-500">
                            <FaUserFriends className="text-2xl" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">No friends yet</h3>
                          <p className={`mb-4 ${
                            darkMode ? 'text-[#d9c7b8]' : 'text-gray-600'
                          }`}>
                            Start by discovering people and sending friend requests
                          </p>
                          <button
                            onClick={() => setActiveTab('discover')}
                            className={`px-4 py-2 rounded-lg ${
                              darkMode 
                                ? 'bg-[#b38a6d] hover:bg-[#c49a7d] text-[#2a211c]' 
                                : 'bg-[#8c6a56] hover:bg-[#9d7b66] text-white'
                            } transition-colors`}
                          >
                            Discover People
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Discover tab */}
                  {activeTab === 'discover' && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Discover People</h2>
                      {users.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {users.map(user => {
                            let actions = null;
                            if (user.status === 'none') {
                              actions = (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSendRequest(user._id)}
                                  disabled={loading.actions}
                                  className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg ${
                                    darkMode 
                                      ? 'bg-[#b38a6d] hover:bg-[#c49a7d] text-[#2a211c]' 
                                      : 'bg-[#8c6a56] hover:bg-[#9d7b66] text-white'
                                  } transition-colors disabled:opacity-50`}
                                >
                                  {loading.actions ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    <>
                                      <FaUserPlus />
                                      <span>Add Friend</span>
                                    </>
                                  )}
                                </motion.button>
                              );
                            } else if (user.status === 'pending') {
                              const req = outgoingRequests.find(r => r.recipient._id === user._id);
                              if (req) {
                                actions = (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCancelRequest(req._id, user._id)}
                                    disabled={loading.actions}
                                    className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg ${
                                      darkMode 
                                        ? 'bg-[#4a413c] hover:bg-[#5a514c] text-[#f8e3d4]' 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    } transition-colors disabled:opacity-50`}
                                  >
                                    {loading.actions ? (
                                      <FaSpinner className="animate-spin" />
                                    ) : (
                                      <>
                                        <FaUserClock />
                                        <span>Request Sent</span>
                                      </>
                                    )}
                                  </motion.button>
                                );
                              }
                            }
                            return renderUserCard(user, actions);
                          })}
                        </div>
                      ) : (
                        <div className={`p-8 rounded-xl text-center ${
                          darkMode ? 'bg-[#3a312c]' : 'bg-white'
                        } shadow-sm`}>
                          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-200 text-gray-500">
                            <FaSearch className="text-2xl" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">
                            {searchQuery ? 'No results found' : 'Search for people'}
                          </h3>
                          <p className={`${darkMode ? 'text-[#d9c7b8]' : 'text-gray-600'}`}>
                            {searchQuery 
                              ? 'Try a different search term' 
                              : 'Enter a name or username to find people'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Requests tab */}
                  {activeTab === 'requests' && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Friend Requests</h2>
                      
                      {/* Incoming requests */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <FaUserAlt className="mr-2" />
                          Incoming Requests ({incomingRequests.length})
                        </h3>
                        {incomingRequests.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {incomingRequests.map(req =>
                              renderUserCard(req.requester, (
                                <div className="flex space-x-2 w-full">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAcceptRequest(req._id)}
                                    disabled={loading.actions}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg ${
                                      darkMode 
                                        ? 'bg-green-700 hover:bg-green-600 text-white' 
                                        : 'bg-green-600 hover:bg-green-500 text-white'
                                    } transition-colors disabled:opacity-50`}
                                  >
                                    {loading.actions ? (
                                      <FaSpinner className="animate-spin" />
                                    ) : (
                                      <>
                                        <FaCheck />
                                        <span>Accept</span>
                                      </>
                                    )}
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRejectRequest(req._id)}
                                    disabled={loading.actions}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg ${
                                      darkMode 
                                        ? 'bg-[#4a413c] hover:bg-[#5a514c] text-[#f8e3d4]' 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    } transition-colors disabled:opacity-50`}
                                  >
                                    {loading.actions ? (
                                      <FaSpinner className="animate-spin" />
                                    ) : (
                                      <>
                                        <FaTimes />
                                        <span>Decline</span>
                                      </>
                                    )}
                                  </motion.button>
                                </div>
                              ))
                            )}
                          </div>
                        ) : (
                          <div className={`p-6 rounded-xl ${
                            darkMode ? 'bg-[#3a312c]' : 'bg-white'
                          } shadow-sm`}>
                            <p className={`text-center ${darkMode ? 'text-[#d9c7b8]' : 'text-gray-600'}`}>
                              No incoming friend requests
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Outgoing requests */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <FaUserClock className="mr-2" />
                          Sent Requests ({outgoingRequests.length})
                        </h3>
                        {outgoingRequests.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {outgoingRequests.map(req =>
                              renderUserCard(req.recipient, (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleCancelRequest(req._id, req.recipient._id)}
                                  disabled={loading.actions}
                                  className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg ${
                                    darkMode 
                                      ? 'bg-[#4a413c] hover:bg-[#5a514c] text-[#f8e3d4]' 
                                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                  } transition-colors disabled:opacity-50`}
                                >
                                  {loading.actions ? (
                                    <FaSpinner className="animate-spin" />
                                  ) : (
                                    <>
                                      <FaTimes />
                                      <span>Cancel Request</span>
                                    </>
                                  )}
                                </motion.button>
                              ))
                            )}
                          </div>
                        ) : (
                          <div className={`p-6 rounded-xl ${
                            darkMode ? 'bg-[#3a312c]' : 'bg-white'
                          } shadow-sm`}>
                            <p className={`text-center ${darkMode ? 'text-[#d9c7b8]' : 'text-gray-600'}`}>
                              No outgoing friend requests
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;