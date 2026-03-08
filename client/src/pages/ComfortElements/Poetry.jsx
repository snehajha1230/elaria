import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/api';
import { toast } from 'react-toastify';
import { X, Plus, BookOpen, Search, Home, Edit } from 'lucide-react';

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

const Poetry = () => {
  const { state } = useLocation();
  const viewOnly = state?.viewOnly || false;
  const friendId = state?.friendId;
  const [poems, setPoems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, poemId: null, poemTitle: '' });
  const navigate = useNavigate();

  const fetchPoems = async () => {
    setIsLoading(true);
    try {
      let endpoint;
      let config = {};
      
      if (viewOnly && friendId) {
        endpoint = `/poems/public/${friendId}`;
        // No auth headers needed for public endpoint
      } else {
        endpoint = '/poems';
        const token = localStorage.getItem('token');
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
      }
      
      const res = await axios.get(endpoint, config);
      setPoems(res.data);
    } catch (err) {
      console.error('Fetch poems error:', err.response?.data || err.message);
      toast.error(viewOnly 
        ? "Couldn't load friend's public poems" 
        : 'Failed to load your poems');
      setPoems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (viewOnly) return;
    
    try {
      await axios.delete(`/poems/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Poem removed from your collection');
      setPoems(poems.filter((p) => p._id !== id));
      setDeleteModal({ isOpen: false, poemId: null, poemTitle: '' });
    } catch (err) {
      console.error('Error deleting poem:', err);
      toast.error('Failed to delete poem');
    }
  };

  const openDeleteModal = (poemId, poemTitle) => {
    setDeleteModal({
      isOpen: true,
      poemId,
      poemTitle: `Are you sure you want to delete "${poemTitle}"?`
    });
  };

  const handleEdit = (poem) => {
    if (viewOnly) return;
    navigate('/add-poem', { state: { poemToEdit: poem } });
  };

  const filteredPoems = poems.filter(poem => 
    poem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (poem.author && poem.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (poem.excerpt && poem.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (poem.content && poem.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchPoems();
  }, [viewOnly, friendId]);

  return (
    <div className={`min-h-screen bg-fixed bg-center py-8 px-4 bg-[#f9f5f0] dark:bg-gray-900`}>
      <div className={`fixed inset-0 bg-[url('/paper-texture.png')] bg-repeat opacity-15 dark:opacity-10 pointer-events-none z-0`}></div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, poemId: null, poemTitle: '' })}
        onConfirm={() => handleDelete(deleteModal.poemId)}
        message={deleteModal.poemTitle}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-lg border border-rose-100 dark:border-gray-700">
          <div className="flex items-center mb-4 md:mb-0">
            <BookOpen className="text-3xl mr-3 text-rose-600 dark:text-rose-400" />
            <h1 className="text-4xl font-serif font-bold text-rose-800 dark:text-rose-200">
              {viewOnly ? "Poetry Room" : "My Poetry Room"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search poems..."
                className="pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-700 border border-rose-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-rose-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => navigate(viewOnly ? '/friendscommunity' : '/comfort-space')}
              className="p-2 rounded-full bg-rose-100 dark:bg-gray-700 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-gray-600 transition"
            >
              <Home size={20} />
            </button>
          </div>
        </header>

        <main className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-rose-100 dark:border-gray-700">
          {!viewOnly && (
            <div className="flex justify-end mb-8">
              <button
                onClick={() => navigate('/add-poem')}
                className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus size={20} />
                <span>Add My Favourites</span>
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-rose-200 dark:bg-rose-800 rounded-full mb-4"></div>
                <div className="h-4 bg-rose-200 dark:bg-rose-800 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-rose-100 dark:bg-rose-900 rounded w-1/2"></div>
              </div>
            </div>
          ) : poems.length === 0 ? (
            <div className="text-center py-16">
              <img src="https://cdn-icons-png.freepik.com/512/10559/10559032.png" alt="No poems" className="mx-auto w-56 opacity-80" />
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                {viewOnly ? "No public poems to display" : "Your poetry journal awaits..."}
              </p>
              {viewOnly && friendId && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This friend hasn't shared any public poems yet.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={{ gridAutoRows: 'min-content' }}>
              {filteredPoems.map((poem) => (
                <div
                  key={poem._id}
                  className="relative group bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-rose-100 dark:border-gray-600 hover:border-rose-300 dark:hover:border-rose-500"
                  style={{ height: 'fit-content' }}
                >
                  <div className="p-6">
                    {!viewOnly && (
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button
                          onClick={() => handleEdit(poem)}
                          className="text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(poem._id, poem.title)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}

                    <div className="mb-6">
                      <h2 className="text-xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {poem.title}
                      </h2>
                      {poem.author && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
                          by {poem.author}
                        </p>
                      )}
                      
                      {/* Display content if available, otherwise show excerpt */}
                      {poem.content ? (
                        <div className="relative">
                          <div className="absolute top-0 left-0 w-1 h-full bg-rose-200 dark:bg-rose-800 rounded-full"></div>
                          <div className="pl-4">
                            <p className="text-gray-700 dark:text-gray-300 font-light leading-relaxed whitespace-pre-line">
                              {poem.content}
                            </p>
                          </div>
                        </div>
                      ) : poem.excerpt ? (
                        <div className="relative">
                          <div className="absolute top-0 left-0 w-1 h-full bg-rose-200 dark:bg-rose-800 rounded-full"></div>
                          <p className="pl-4 text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                            {poem.excerpt}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {/* Show Read Full Poem button only for link-based poems */}
                    {poem.linkUrl && !poem.content && (
                      <a
                        href={poem.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full text-center bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-4 py-2 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-800 transition"
                      >
                        Read Full Poem
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            {viewOnly ? "Viewing friend's collection" : "Your personal poetry room"} • {poems.length} poems
          </p>
          {!viewOnly && (
            <p className="mt-1">"Poetry is when an emotion has found its thought and the thought has found words." — Robert Frost</p>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Poetry;