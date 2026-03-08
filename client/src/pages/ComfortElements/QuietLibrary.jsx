import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaBookOpen, FaSearch, FaHome, FaExternalLinkAlt, FaEdit } from 'react-icons/fa';
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

const QuietLibrary = () => {
  const { state } = useLocation();
  const viewOnly = state?.viewOnly || false;
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, bookId: null, bookTitle: '' });
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // For view-only mode, fetch public books from friend's collection
      const endpoint = viewOnly && state?.friendId 
        ? `/books/public/${state.friendId}`
        : '/books';
      
      const res = await axios.get(endpoint, config);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      toast.error(viewOnly ? 'Failed to load books' : 'Failed to load your books');
    }
  };

  const deleteBook = async (id) => {
    if (viewOnly) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Book removed from your shelf');
      setBooks(books.filter((book) => book._id !== id));
      setDeleteModal({ isOpen: false, bookId: null, bookTitle: '' });
    } catch {
      toast.error('Could not delete book');
    }
  };

  const openDeleteModal = (bookId, bookTitle) => {
    setDeleteModal({
      isOpen: true,
      bookId,
      bookTitle: `Are you sure you want to delete "${bookTitle}"?`
    });
  };

  const handleEdit = (book) => {
    if (viewOnly) return;
    navigate('/add-book', { state: { bookToEdit: book } });
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchBooks();
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
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
    <div className={`min-h-screen bg-fixed bg-center py-8 px-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-[#f5f1e6]'}`}>
      {/* Wooden Shelf Background */}
      <div className={`fixed inset-0 bg-[url('/wooden-shelf-texture.png')] bg-repeat opacity-10 dark:opacity-5 pointer-events-none z-0`}></div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, bookId: null, bookTitle: '' })}
        onConfirm={() => deleteBook(deleteModal.bookId)}
        message={deleteModal.bookTitle}
      />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-lg border border-amber-100 dark:border-gray-700">
          <div className="flex items-center mb-4 md:mb-0">
            <FaBookOpen className="text-3xl mr-3 text-amber-600 dark:text-amber-400" />
            <h1 className="text-4xl font-serif font-bold text-amber-800 dark:text-amber-200">
              {viewOnly ? "Reading Room" : "My Reading Room"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search books..."
                className="pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-700 border border-amber-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => navigate(viewOnly ? '/friendscommunity' : '/comfort-space')}
              className="p-2 rounded-full bg-amber-100 dark:bg-gray-700 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-gray-600 transition"
              aria-label={viewOnly ? "Go to friends list" : "Go to comfort space"}
            >
              <FaHome />
            </button>
          </div>
        </header>

        {/* Main Shelf Area */}
        <main className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-amber-100 dark:border-gray-700">
          {/* Add Book Button - Hidden in view-only mode */}
          {!viewOnly && (
            <div className="flex justify-end mb-8">
              <button
                onClick={() => navigate('/add-book')}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaPlus />
                <span>Add My Favourites</span>
              </button>
            </div>
          )}

          {/* Books Grid */}
          {books.length === 0 ? (
            <div className="text-center py-16">
              <img 
                src="https://static.thenounproject.com/png/1433745-200.png" 
                alt="No books" 
                className="mx-auto w-56 opacity-80" 
              />
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                {viewOnly ? "No public books to display" : "Your shelf is waiting for stories..."}
              </p>
              {!viewOnly && (
                <p className="text-sm text-gray-400">Begin your collection with a book that speaks to your soul.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="relative group bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-500"
                >
                  {/* Book Cover */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={book.coverUrl || '/default-book-cover.jpg'}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-book-cover.jpg';
                      }}
                    />
                    {/* Book URL Link */}
                    {book.bookUrl && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                        <a
                          href={book.bookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaExternalLinkAlt size={24} />
                        </a>
                      </div>
                    )}
                    {/* Reading Progress */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600">
                      <div 
                        className="h-full bg-amber-500" 
                        style={{ width: `${book.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-5 bg-white dark:bg-gray-700">
                    <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-100 mb-1 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-3 line-clamp-1">
                      by {book.author}
                    </p>
                    {book.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="inline-block bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 text-xs rounded-full">
                        {book.genre || 'Uncategorized'}
                      </span>
                      {book.progress > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(book.progress)}% read
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons - Hidden in view-only mode */}
                  {!viewOnly && (
                    <div className="absolute top-3 right-3 flex space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(book);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <FaEdit size={14} />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(book._id, book.title);
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
            {viewOnly ? "Viewing friend's collection" : "Your personal reading room of stories"} • {books.length} books
          </p>
          {!viewOnly && (
            <p className="mt-1">"A room without books is like a body without a soul." — Cicero</p>
          )}
        </footer>
      </div>
    </div>
  );
};

export default QuietLibrary;