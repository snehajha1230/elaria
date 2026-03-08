import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/api';
import { toast } from 'react-toastify';

const AddMedia = () => {
  const location = useLocation();
  const [form, setForm] = useState({
    title: '',
    type: '',
    thumbnailUrl: '',
    mediaUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mediaId, setMediaId] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.mediaToEdit) {
      const { _id, title, type, thumbnailUrl, mediaUrl } = location.state.mediaToEdit;
      setForm({ title, type, thumbnailUrl, mediaUrl });
      setThumbnailPreview(thumbnailUrl);
      setIsEditing(true);
      setMediaId(_id);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Update thumbnail preview when thumbnailUrl changes
    if (name === 'thumbnailUrl') {
      setThumbnailPreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to add to your comfort collection');
      setIsSubmitting(false);
      return;
    }

    if (!form.title || !form.mediaUrl) {
      toast.error('Title and media link are required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`/media/${mediaId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Media updated successfully!');
      } else {
        await axios.post('/media', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Media added to your comfort collection!');
      }
      navigate('/comfort-screen');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error saving your media');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-blue-900 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Panel - Cinematic Inspiration */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 dark:from-gray-900 dark:to-blue-900/70 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1950&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <h2 className="text-3xl font-bold font-serif text-blue-100">
                    Screen Room
                  </h2>
                </div>
                <div className="w-16 h-1 bg-blue-400 mb-4"></div>
                <p className="text-blue-200 italic font-serif text-lg leading-relaxed">
                  "We don't escape into movies. We escape through them into ourselves."<br />
                  <span className="text-blue-300">— Roger Ebert</span>
                </p>
              </div>
              
              <div className="relative mt-8">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-600/20 rounded-full"></div>
                <div className="relative bg-white/10 dark:bg-black/20 p-6 rounded-lg backdrop-blur-sm border border-blue-300/20">
                  <h3 className="font-bold text-blue-100 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Pro Tip
                  </h3>
                  <p className="text-sm text-blue-200">
                    Add media that brings you comfort - favorite movies, nostalgic shows, or calming animations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-auto pt-4 border-t border-blue-700/50">
              <p className="text-xs text-blue-300/80">
                <span className="font-semibold">Note:</span> Your collection becomes a personalized retreat.
              </p>
            </div>
          </div>

          {/* Right Panel - Add Media Form */}
          <div className="w-full md:w-3/5 bg-white dark:bg-gray-800 p-8 flex flex-col">
            <div className="flex items-center mb-8">
              <div className="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {isEditing ? 'Edit Comfort Media' : 'Add Comfort Media'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="What's this comforting title?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Type (Movie, Series, Anime)
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200"
                >
                  <option value="">Select type...</option>
                  <option value="Movie">Movie</option>
                  <option value="Series">Series</option>
                  <option value="Anime">Anime</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  name="thumbnailUrl"
                  value={form.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="Paste an image link for visual comfort"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
                {/* Thumbnail Preview */}
                {thumbnailPreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                    <div className="relative w-32 h-48 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Link to Watch *
                </label>
                <input
                  type="url"
                  name="mediaUrl"
                  value={form.mediaUrl}
                  onChange={handleChange}
                  required
                  placeholder="Where can we find this comfort watch?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${isSubmitting 
                    ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md hover:shadow-lg'} text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditing ? 'Updating Media...' : 'Saving Your Comfort Pick...'}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {isEditing ? 'Update Media' : 'Add to Screen Room'}
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => navigate('/comfort-screen')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Screen Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedia;