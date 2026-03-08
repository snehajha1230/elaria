import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaFilm, FaSearch, FaPlay, FaHome, FaEdit } from 'react-icons/fa';
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

const ComfortScreen = () => {
  const { state } = useLocation();
  const viewOnly = state?.viewOnly || false;
  const [mediaList, setMediaList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, mediaId: null, mediaTitle: '' });
  const navigate = useNavigate();

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // For view-only mode, fetch public media from friend's collection
      const endpoint = viewOnly && state?.friendId 
        ? `/media/public/${state.friendId}`
        : '/media';
      
      const res = await axios.get(endpoint, config);
      setMediaList(res.data);
    } catch (err) {
      console.error(err);
      toast.error(viewOnly ? 'Failed to load media' : 'Failed to load your media');
    }
  };

  const handleDelete = async (id) => {
    if (viewOnly) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Media removed from your collection');
      setMediaList(mediaList.filter((media) => media._id !== id));
      setDeleteModal({ isOpen: false, mediaId: null, mediaTitle: '' });
    } catch {
      toast.error('Could not delete media');
    }
  };

  const openDeleteModal = (mediaId, mediaTitle) => {
    setDeleteModal({
      isOpen: true,
      mediaId,
      mediaTitle: `Are you sure you want to delete "${mediaTitle}"?`
    });
  };

  const handleEdit = (media) => {
    if (viewOnly) return;
    navigate('/add-media', { state: { mediaToEdit: media } });
  };

  const handleWatch = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('No link provided');
    }
  };

  const filteredMedia = mediaList.filter(media => 
    media.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (media.description && media.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchMedia();
  }, [viewOnly, state?.friendId]);

  return (
    <div className="min-h-screen bg-fixed bg-center py-8 px-4 bg-gradient-to-br from-gray-900 to-blue-900 dark:from-gray-900 dark:to-gray-800">
      {/* Background Texture */}
      <div className="fixed inset-0 bg-[url('/blue-texture.png')] bg-repeat opacity-10 dark:opacity-5 pointer-events-none z-0"></div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mediaId: null, mediaTitle: '' })}
        onConfirm={() => handleDelete(deleteModal.mediaId)}
        message={deleteModal.mediaTitle}
      />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-lg border border-blue-100 dark:border-gray-700">
          <div className="flex items-center mb-4 md:mb-0">
            <FaFilm className="text-3xl mr-3 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-serif font-bold text-blue-800 dark:text-blue-200">
              {viewOnly ? "Screen Room" : "My Screen Room"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search media..."
                className="pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-700 border border-blue-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => navigate(viewOnly ? '/friendscommunity' : '/comfort-space')}
              className="p-2 rounded-full bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-gray-600 transition"
            >
              <FaHome />
            </button>
          </div>
        </header>

        {/* Main Shelf Area */}
        <main className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-blue-100 dark:border-gray-700">
          {/* Add Media Button - Hidden in view-only mode */}
          {!viewOnly && (
            <div className="flex justify-end mb-8">
              <button
                onClick={() => navigate('/add-media')}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaPlus />
                <span>Add My Favourites</span>
              </button>
            </div>
          )}

          {/* Media Grid */}
          {mediaList.length === 0 ? (
            <div className="text-center py-16">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3875/3875391.png" 
                alt="No media" 
                className="mx-auto w-56 opacity-80" 
              />
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                {viewOnly ? "No public media to display" : "Your Screen Room is empty... 🎬"}
              </p>
              {!viewOnly && (
                <p className="text-sm text-gray-400">Add your favorite movies, shows or videos to relax with.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMedia.map((media) => (
                <div
                  key={media._id}
                  className="relative group bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                >
                  {/* Media Thumbnail */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={media.thumbnailUrl || '/default-media-cover.jpg'}
                      alt={media.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-media-cover.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => handleWatch(media.mediaUrl)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-500/90 hover:bg-blue-600 text-white p-4 rounded-full shadow-xl"
                      >
                        <FaPlay size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Media Details */}
                  <div className="p-5 bg-white dark:bg-gray-700">
                    <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-100 mb-1 line-clamp-1">
                      {media.title}
                    </h3>
                    <p className="text-sm text-white bg-blue-500 px-2 py-1 rounded-md inline-block mb-3">
                      {media.type}
                    </p>
                    {media.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {media.description}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons - Hidden in view-only mode */}
                  {!viewOnly && (
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(media);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(media._id, media.title);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            {viewOnly ? "Viewing friend's collection" : "Your personal screen room"} • {mediaList.length} items
          </p>
          {!viewOnly && (
            <p className="mt-1">"Movies can and do have tremendous influence in shaping young lives." — Walt Disney</p>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ComfortScreen;