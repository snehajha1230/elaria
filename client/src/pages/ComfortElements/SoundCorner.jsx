import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaMusic, FaSearch, FaHome, FaPlay, FaEdit } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/api';
import { toast } from 'react-toastify';

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Confirm Deletion</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const SoundCorner = () => {
  const { state } = useLocation();
  const viewOnly = state?.viewOnly || false;
  const [tracks, setTracks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, trackId: null, trackTitle: '' });
  const navigate = useNavigate();

  const fetchTracks = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // For view-only mode, fetch public tracks from friend's collection
      const endpoint = viewOnly && state?.friendId 
        ? `/tracks/public/${state.friendId}`
        : '/tracks';
      
      const res = await axios.get(endpoint, config);
      setTracks(res.data);
    } catch (err) {
      console.error(err);
      toast.error(viewOnly ? 'Failed to load tracks' : 'Failed to load your tracks');
    }
  };

  const handleDelete = async (id) => {
    if (viewOnly) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/tracks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Track removed from your collection');
      setTracks(tracks.filter((track) => track._id !== id));
      setDeleteModal({ isOpen: false, trackId: null, trackTitle: '' });
    } catch {
      toast.error('Could not delete track');
    }
  };

  const openDeleteModal = (trackId, trackTitle) => {
    setDeleteModal({
      isOpen: true,
      trackId,
      trackTitle: `Are you sure you want to delete "${trackTitle}"?`
    });
  };

  const handleEdit = (track) => {
    if (viewOnly) return;
    navigate('/add-track', { state: { trackToEdit: track } });
  };

  // Function to get the correct cover URL (handles both URL and uploaded files)
  const getCoverUrl = (track) => {
    if (track.coverUrl) return track.coverUrl;
    if (track.coverImage) return `/uploads/covers/${track.coverImage}`;
    return null;
  };

  // Function to get the correct track URL (handles both URL and uploaded files)
  const getTrackUrl = (track) => {
    if (track.trackUrl) return track.trackUrl;
    if (track.audioFile) return `/uploads/audio/${track.audioFile}`;
    return null;
  };

  // Function to handle play/pause of audio tracks
  const handlePlayTrack = (track) => {
    const trackUrl = getTrackUrl(track);
    if (!trackUrl) return;
    
    if (currentTrack === track._id && isPlaying) {
      // Pause current track
      setIsPlaying(false);
      setCurrentTrack(null);
    } else {
      // Play new track
      setCurrentTrack(track._id);
      setIsPlaying(true);
      
      // In a real app, you would use an audio player library
      // For this example, we'll just open the audio in a new tab
      window.open(trackUrl, '_blank');
    }
  };

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (track.artist && track.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchTracks();
    // Initialize dark mode from localStorage or system preference
    if (localStorage.getItem('darkMode') === null) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      localStorage.setItem('darkMode', prefersDark);
    }
  }, [viewOnly, state?.friendId]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-300`}>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, trackId: null, trackTitle: '' })}
        onConfirm={() => handleDelete(deleteModal.trackId)}
        message={deleteModal.trackTitle}
      />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-gray-800/90 shadow-lg border border-purple-300/20">
          <div className="flex items-center mb-4 md:mb-0">
            <FaMusic className="text-3xl mr-3 text-purple-400" />
            <h1 className="text-4xl font-serif font-bold text-purple-100">
              {viewOnly ? "Music Room" : "My Music Room"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-purple-300" />
              <input
                type="text"
                placeholder="Search tracks..."
                className="pl-10 pr-4 py-2 rounded-full bg-white/10 dark:bg-gray-700 border border-purple-300/30 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500 text-purple-100 placeholder-purple-300/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => navigate(viewOnly ? '/friendscommunity' : '/comfort-space')}
              className="p-2 rounded-full bg-purple-600/30 dark:bg-gray-700 text-purple-200 dark:text-purple-300 hover:bg-purple-700/40 dark:hover:bg-gray-600 transition"
              title={viewOnly ? "Go to Friends" : "Go to Comfort Space"}
              aria-label={viewOnly ? "Go to Friends" : "Go to Comfort Space"}
            >
              <FaHome />
            </button>
          </div>
        </header>

        {/* Main Shelf Area */}
        <main className="bg-white/10 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-purple-300/20">
          {/* Add Track Button - Hidden in view-only mode */}
          {!viewOnly && (
            <div className="flex justify-end mb-8">
              <button
                onClick={() => navigate('/add-track')}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaPlus />
                <span>Add My Favourites</span>
              </button>
            </div>
          )}

          {/* Tracks Grid */}
          {tracks.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-56 opacity-80 flex justify-center text-purple-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-56 w-56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p className="mt-6 text-xl text-purple-200">
                {viewOnly ? "No public tracks to display" : "Your music room is silent... 🎵"}
              </p>
              {!viewOnly && (
                <p className="text-sm text-purple-300/80">Add your favorite tracks to fill it with melody.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredTracks.map((track) => {
                const coverUrl = getCoverUrl(track);
                const trackUrl = getTrackUrl(track);
                const isCurrentTrack = currentTrack === track._id;
                
                return (
                  <div
                    key={track._id}
                    className="relative group bg-white/10 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-purple-300/20 dark:border-gray-600 hover:border-purple-400/50 dark:hover:border-purple-500"
                  >
                    {/* Track Cover */}
                    <div className="relative h-64 overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-music-cover.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-900/20 dark:bg-purple-900/50 flex items-center justify-center text-purple-300 dark:text-purple-400">
                          <FaMusic className="text-4xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        {trackUrl ? (
                          <button
                            onClick={() => handlePlayTrack(track)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                              isCurrentTrack && isPlaying 
                                ? 'bg-red-600/90 hover:bg-red-700' 
                                : 'bg-purple-600/90 hover:bg-purple-700'
                            } text-white p-4 rounded-full shadow-xl`}
                            title={isCurrentTrack && isPlaying ? "Pause" : "Play"}
                          >
                            {isCurrentTrack && isPlaying ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <FaPlay size={16} />
                            )}
                          </button>
                        ) : (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-600/90 text-white p-2 px-3 rounded-full text-xs">
                            No audio available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Track Details */}
                    <div className="p-5 bg-white/5 dark:bg-gray-700">
                      <h3 className="text-lg font-serif font-bold text-purple-100 dark:text-gray-100 mb-1 line-clamp-1">
                        {track.title}
                      </h3>
                      {track.artist && (
                        <p className="text-sm text-purple-200 dark:text-gray-300 italic mb-3 line-clamp-1">
                          by {track.artist}
                        </p>
                      )}
                      {track.album && (
                        <p className="text-xs text-purple-300/80 dark:text-gray-400 mb-3 line-clamp-1">
                          {track.album}
                        </p>
                      )}
                      
                      {/* Track source indicator */}
                      <div className="mt-2 flex items-center text-xs">
                        {track.trackUrl ? (
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                            {track.trackUrl.includes('youtube') ? 'YouTube' : 
                             track.trackUrl.includes('spotify') ? 'Spotify' : 'External Link'}
                          </span>
                        ) : track.audioFile ? (
                          <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                            Uploaded Audio
                          </span>
                        ) : null}
                        
                        {coverUrl && !track.coverUrl && (
                          <span className="ml-2 bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                            Uploaded Cover
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons - Hidden in view-only mode */}
                    {!viewOnly && (
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(track);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(track._id, track.title);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-purple-300/80 dark:text-gray-400">
          <p>
            {viewOnly ? "Viewing friend's collection" : "Your personal music room"} • {tracks.length} tracks
          </p>
          {!viewOnly && (
            <p className="mt-1">"Where words fail, music speaks." — Hans Christian Andersen</p>
          )}
        </footer>
      </div>
    </div>
  );
};

export default SoundCorner;