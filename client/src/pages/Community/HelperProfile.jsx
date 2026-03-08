import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/api';
import { FaUserCircle } from 'react-icons/fa';
import { io } from 'socket.io-client';

const HelperProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [helper, setHelper] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchHelper = async () => {
      try {
        const res = await axios.get(`/helpers/${id}`);
        setHelper(res.data);
      } catch (err) {
        console.error('Failed to fetch helper:', err);
      }
    };

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    fetchHelper();

    return () => {
      newSocket.off('requestUpdate'); // Clean up listener
      newSocket.disconnect();
    };
  }, [id]);

  const handleChatRequest = async () => {
    setIsRequesting(true);
    try {
      const res = await axios.post('/chat/request', { helperId: id });
      setRequestStatus('pending');
      
      const userId = localStorage.getItem('userId');
      if (userId) {
        socket.emit('joinUserRoom', userId);
        socket.on('requestUpdate', (request) => {
          if (request.status === 'accepted' && request.chatSession) {
            navigate(`/chat/${request.chatSession._id}`);
          } else if (request.status === 'declined') {
            setRequestStatus('declined');
          }
        });
      }
    } catch (err) {
      console.error('Request failed:', err);
      setRequestStatus('error');
    } finally {
      setIsRequesting(false);
    }
  };

  if (!helper) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <FaUserCircle size={50} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-blue-700">
              {helper.user?.name || 'Anonymous'}
            </h2>
            <p className="text-sm italic text-gray-600">{helper.role}</p>
          </div>
        </div>

        <p className="text-md mb-4">{helper.bio}</p>

        <p className={`text-sm mb-6 ${helper.available ? 'text-green-600' : 'text-red-600'}`}>
          {helper.available ? '✅ Available' : '🚫 Unavailable'}
        </p>

        <div className="mt-6">
          {requestStatus === 'pending' ? (
            <div className="p-4 bg-blue-100 rounded-lg text-blue-800">
              Request sent! Waiting for response...
            </div>
          ) : requestStatus === 'declined' ? (
            <div className="p-4 bg-red-100 rounded-lg text-red-800">
              Request declined. Try another helper.
            </div>
          ) : requestStatus === 'error' ? (
            <div className="p-4 bg-red-100 rounded-lg text-red-800">
              Failed to send request. Try again.
            </div>
          ) : (
            <button
              onClick={handleChatRequest}
              disabled={!helper.available || isRequesting}
              className={`py-2 px-4 rounded-full text-white font-semibold ${
                helper.available 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              {isRequesting ? 'Sending...' : 'Request Chat'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelperProfile;