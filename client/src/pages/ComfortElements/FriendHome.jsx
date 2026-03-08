import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComfortSpace from '../ComfortSpace';
import {
  FaMusic,
  FaFilm,
  FaPenFancy,
  FaBook,
  FaTrashAlt,
  FaStickyNote
} from 'react-icons/fa';
import api from '../../utils/api';

const FriendHome = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [friendName, setFriendName] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/rooms/friends/${friendId}/rooms`);
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          const roomsData = response.data.data || [];
          console.log('Raw rooms data:', roomsData);
          
          setRooms(roomsData);
          setFriendName(response.data.friendName || 'Friend');
        } else {
          throw new Error(response.data.message || 'Failed to fetch friend rooms');
        }
      } catch (err) {
        console.error('Error loading friend rooms:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load friend rooms');
        
        if (err.response?.status === 403) {
          navigate('/friendscommunity');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRooms();
  }, [friendId, navigate]);

  const defaultRoomMap = {
    music: {
      name: 'Music Room',
      icon: <FaMusic />,
      path: '/sound-corner',
      position: { gridArea: '1 / 2 / 2 / 3' }
    },
    cinema: {
      name: 'Screen Room',
      icon: <FaFilm />,
      path: '/comfort-screen',
      position: { gridArea: '1 / 4 / 2 / 5' }
    },
    poetry: {
      name: 'Poetry Room',
      icon: <FaPenFancy />,
      path: '/poetry',
      position: { gridArea: '2 / 1 / 3 / 2' }
    },
    library: {
      name: 'Reading Room',
      icon: <FaBook />,
      path: '/quiet-library',
      position: { gridArea: '2 / 5 / 3 / 6' }
    },
    release: {
      name: 'Let-Go Space',
      icon: <FaTrashAlt />,
      path: '/crush-notes',
      position: { gridArea: '3 / 2 / 4 / 3' }
    },
    diary: {
      name: 'Diary Space',
      icon: <FaStickyNote />,
      path: '/self-diary',
      position: { gridArea: '3 / 4 / 4 / 5' }
    }
  };

  const transformRooms = (roomsData) => {
    if (!Array.isArray(roomsData)) return [];
    
    return roomsData.map(room => {
      const defaultRoom = defaultRoomMap[room.roomId];
      if (!defaultRoom) {
        console.warn(`No default configuration for roomId: ${room.roomId}`);
        return null;
      }
      return {
        id: room.roomId,
        name: defaultRoom.name,
        icon: defaultRoom.icon,  
        path: defaultRoom.path,
        position: defaultRoom.position,
        isPublic: room.isPublic,
        friendId: friendId
      };
    }).filter(room => room !== null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#fff' : '#333'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `5px solid ${darkMode ? '#333' : '#e0e0e0'}`,
            borderTop: `5px solid ${darkMode ? '#4285f4' : '#1a73e8'}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>Loading Comfort Space..</p>
        </div>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => navigate('/friendscommunity')}>Back to Friends</button>
      </div>
    );
  }

  return (
    <ComfortSpace
      darkMode={darkMode}
      viewOnly={true}
      rooms={transformRooms(rooms)}
    />
  );
};

export default FriendHome;