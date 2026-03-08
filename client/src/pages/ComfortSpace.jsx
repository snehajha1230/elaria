import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaMusic,
  FaFilm,
  FaPenFancy,
  FaBook,
  FaTrashAlt,
  FaStickyNote,
  FaLeaf,
  FaSun,
  FaHome,
  FaLock,
  FaUnlock,
  FaArrowLeft,
  FaUserFriends
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../utils/api';

const defaultRoomConfig = [
  {
    id: 'music',
    name: 'Music Room',
    icon: <FaMusic />,
    path: '/sound-corner',
    position: { gridArea: '1 / 2 / 2 / 3' }
  },
  {
    id: 'cinema',
    name: 'Screen Room',
    icon: <FaFilm />,
    path: '/comfort-screen',
    position: { gridArea: '1 / 4 / 2 / 5' }
  },
  {
    id: 'poetry',
    name: 'Poetry Room',
    icon: <FaPenFancy />,
    path: '/poetry',
    position: { gridArea: '2 / 1 / 3 / 2' }
  },
  {
    id: 'library',
    name: 'Reading Room',
    icon: <FaBook />,
    path: '/quiet-library',
    position: { gridArea: '2 / 5 / 3 / 6' }
  },
  {
    id: 'release',
    name: 'Let-Go Space',
    icon: <FaTrashAlt />,
    path: '/crush-notes',
    position: { gridArea: '3 / 2 / 4 / 3' }
  },
  {
    id: 'diary',
    name: 'Diary Space',
    icon: <FaStickyNote />,
    path: '/self-diary',
    position: { gridArea: '3 / 4 / 4 / 5' }
  }
];

const ComfortSpace = ({ darkMode, viewOnly = false, rooms: propRooms = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);

  const friendName = viewOnly ? location.state?.friendName || "Friend" : null;

  React.useEffect(() => {
    let isMounted = true;

    const initializeRooms = async () => {
      try {
        setLoading(true);
        
        if (viewOnly) {
          if (isMounted) setRooms(propRooms);
          return;
        }

        const response = await api.get('/rooms');
        const serverRooms = response.data?.data || response.data || [];
        
        const mergedRooms = defaultRoomConfig.map(room => {
          const serverRoom = serverRooms.find(r => r.roomId === room.id);
          return {
            ...room,
            isPublic: serverRoom ? serverRoom.isPublic : true
          };
        });
        
        if (isMounted) setRooms(mergedRooms);
      } catch (error) {
        console.error('Error initializing rooms:', error);
        if (isMounted) setRooms(defaultRoomConfig.map(room => ({ ...room, isPublic: true })));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeRooms();

    return () => {
      isMounted = false;
    };
  }, [viewOnly]);

  const toggleRoomPrivacy = async (roomId) => {
    if (viewOnly || loading) return;

    try {
      setLoading(true);
      const updatedRooms = rooms.map(room => {
        if (room.id === roomId) {
          return { ...room, isPublic: !room.isPublic };
        }
        return room;
      });
      setRooms(updatedRooms);
      
      await api.put(`/rooms/${roomId}`, { 
        isPublic: !rooms.find(r => r.id === roomId).isPublic 
      });
    } catch (error) {
      console.error('Failed to update room privacy:', error);
      setRooms([...rooms]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    navigate(room.path, { state: { 
        viewOnly: viewOnly,
        friendId: room.friendId // This comes from the transformed rooms
      } });
  };
  const handleFriends = () => navigate('/friendscommunity');

  const roomVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  const displayedRooms = viewOnly 
    ? rooms.filter(room => room.isPublic) 
    : rooms;

  return (
    <div className={`min-h-screen w-full overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-[#2a211c] text-[#f8e3d4]' : 'bg-[#fff9f5] text-[#5a4a42]'}`}>
      <div className="fixed top-4 right-4 z-50 flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(viewOnly ? '/friendscommunity' : '/home')}
          className={`p-3 rounded-full ${darkMode ? 'bg-[#3a312c] text-[#f8e3d4]' : 'bg-[#f8e3d4] text-[#8c6a56]'}`}
        >
          {viewOnly ? <FaArrowLeft /> : <FaHome />}
        </motion.button>
        {!viewOnly && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFriends}
            className={`p-3 rounded-full ${darkMode ? 'bg-[#3a312c] text-[#f8e3d4]' : 'bg-[#f8e3d4] text-[#8c6a56]'}`}
          >
            <FaUserFriends />
          </motion.button>
        )}
      </div>

      <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center space-x-2 mx-auto"
          >
            <FaLeaf className={`text-3xl ${darkMode ? 'text-[#b38a6d]' : 'text-[#8c6a56]'}`} />
            <span className={`text-3xl font-serif font-bold tracking-wide ${darkMode ? 'text-[#f8e3d4]' : 'text-[#5a4a42]'}`}>ELARIA</span>
          </motion.div>
          <h1 className={`text-4xl md:text-5xl font-bold mt-4 font-serif tracking-tight leading-tight ${darkMode ? 'text-[#f8e3d4]' : 'text-[#5a4a42]'}`}>
            {viewOnly ? `${friendName}'s` : "Your"} <span className={darkMode ? 'text-[#b38a6d]' : 'text-[#8c6a56]'}>Comfort</span> Home
          </h1>
        </motion.div>

        <div className="relative w-full max-w-4xl h-3/5">
          <div className="grid grid-cols-6 grid-rows-4 h-full w-full gap-0">
            {displayedRooms.map((room) => (
              <motion.div
                key={room.id}
                className={`flex flex-col items-center justify-center cursor-pointer z-20 ${darkMode ? 'hover:bg-[#3a312c]/50' : 'hover:bg-[#f8e3d4]/50'} rounded-lg`}
                style={room.position}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={roomVariants}
              >
                <div className="relative">
                  <div 
                    className={`p-5 rounded-full ${darkMode ? 'bg-[#3a312c]' : 'bg-white'} shadow-lg`}
                    onClick={() => handleRoomClick(room)}
                  >
                    <div className={`text-4xl ${darkMode ? 'text-[#b38a6d]' : 'text-[#8c6a56]'}`}>
                      {room.icon}
                    </div>
                  </div>
                  {!viewOnly && (
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRoomPrivacy(room.id);
                      }}
                      disabled={loading}
                      className={`absolute -top-2 -right-2 p-2 rounded-full ${darkMode ? 'bg-[#3a312c]' : 'bg-white'} shadow-md`}
                    >
                      {room.isPublic ? (
                        <FaUnlock className={darkMode ? 'text-green-400' : 'text-green-600'} />
                      ) : (
                        <FaLock className={darkMode ? 'text-red-400' : 'text-red-600'} />
                      )}
                    </motion.button>
                  )}
                </div>
                <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-[#f8e3d4]' : 'text-[#5a4a42]'}`}>
                  {room.name}
                </h3>
                {!viewOnly && (
                  <span className={`text-xs ${darkMode ? 'text-[#d9c7b8]' : 'text-[#7a6a62]'}`}>
                    {room.isPublic ? 'Public' : 'Private'}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
              className="absolute"
            >
              <path 
                d="M15,15 H85 V85 H55 V65 H15 Z" 
                fill="none" 
                stroke={darkMode ? '#b38a6d' : '#8c6a56'} 
                strokeWidth="0.5" 
              />
              <path d="M15,35 H55" fill="none" stroke={darkMode ? '#b38a6d' : '#8c6a56'} strokeWidth="0.5" />
              <path d="M55,15 V65" fill="none" stroke={darkMode ? '#b38a6d' : '#8c6a56'} strokeWidth="0.5" />
              <path d="M55,50 H85" fill="none" stroke={darkMode ? '#b38a6d' : '#8c6a56'} strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`mt-8 text-center text-sm ${darkMode ? 'text-[#d9c7b8]' : 'text-[#7a6a62]'}`}
        >
          <p>{viewOnly ? "You're viewing a friend's public rooms" : "Take a deep breath. You're exactly where you need to be."}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ComfortSpace;