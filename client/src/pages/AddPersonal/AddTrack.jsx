import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/api';
import { toast } from 'react-toastify';

const AddTrack = () => {
  const location = useLocation();
  const [form, setForm] = useState({
    title: '',
    artist: '',
    coverUrl: '',
    trackUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [trackId, setTrackId] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.trackToEdit) {
      const { _id, title, artist, coverUrl, trackUrl } = location.state.trackToEdit;
      setForm({ title, artist, coverUrl, trackUrl });
      setIsEditing(true);
      setTrackId(_id);
    }
  }, [location.state]);

  // Function to extract video ID from YouTube URL
  const extractYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  // Function to extract track ID from Spotify URL
  const extractSpotifyId = (url) => {
    const regExp = /spotify\.com\/track\/([a-zA-Z0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : false;
  };

  // Function to fetch track data from the backend
  const fetchTrackData = async (url) => {
    setIsFetchingData(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/tracks/fetch-info', { url }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setForm(prev => ({
          ...prev,
          title: response.data.title || prev.title,
          artist: response.data.artist || prev.artist,
          coverUrl: response.data.coverUrl || prev.coverUrl
        }));
        toast.success('Track information fetched successfully!');
      }
    } catch (err) {
      console.error('Error fetching track info:', err);
      toast.error('Could not fetch track information. Please fill manually.');
    } finally {
      setIsFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle track URL change with debounce for auto-fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.trackUrl) {
        const isYouTube = form.trackUrl.includes('youtube.com') || form.trackUrl.includes('youtu.be');
        const isSpotify = form.trackUrl.includes('spotify.com');
        
        if ((isYouTube || isSpotify) && !form.title) {
          fetchTrackData(form.trackUrl);
        }
      }
    }, 1000); // Wait 1 second after typing stops

    return () => clearTimeout(timer);
  }, [form.trackUrl]); // Only re-run when trackUrl changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to add to your sound collection');
      setIsSubmitting(false);
      return;
    }

    if (!form.trackUrl || !form.title) {
      toast.error('Track link and title are required');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data to send to backend
      const dataToSend = {
        title: form.title,
        artist: form.artist,
        trackUrl: form.trackUrl,
        coverUrl: form.coverUrl
      };

      if (isEditing) {
        await axios.put(`/tracks/${trackId}`, dataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Track updated successfully!');
      } else {
        await axios.post('/tracks', dataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Track added to your sound collection!');
      }
      navigate('/sound-corner');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error saving your track');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual fetch button handler
  const handleFetchData = () => {
    if (form.trackUrl) {
      fetchTrackData(form.trackUrl);
    } else {
      toast.error('Please enter a YouTube or Spotify link first');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-purple-900 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Panel - Musical Inspiration */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 dark:from-gray-900 dark:to-purple-900/70 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "url('https://i.pinimg.com/736x/7e/ac/14/7eac1404728921a5d16d575512f4067d.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <h2 className="text-3xl font-bold font-serif text-purple-100">
                    Music Room
                  </h2>
                </div>
                <div className="w-16 h-1 bg-purple-400 mb-4"></div>
                <p className="text-purple-200 italic font-serif text-lg leading-relaxed">
                  "Music can heal the wounds which medicine cannot touch."<br />
                  <span className="text-purple-300">— Debasish Mridha</span>
                </p>
              </div>
              
              <div className="relative mt-8">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-purple-600/20 rounded-full"></div>
                <div className="relative bg-white/10 dark:bg-black/20 p-6 rounded-lg backdrop-blur-sm border border-purple-300/20">
                  <h3 className="font-bold text-purple-100 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    Pro Tip
                  </h3>
                  <p className="text-sm text-purple-200">
                    Paste a YouTube or Spotify link to automatically fill track information.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-auto pt-4 border-t border-purple-700/50">
              <p className="text-xs text-purple-300/80">
                <span className="font-semibold">Note:</span> Your collection becomes a personalized auditory retreat.
              </p>
            </div>
          </div>

          {/* Right Panel - Add Track Form */}
          <div className="w-full md:w-3/5 bg-white dark:bg-gray-800 p-8 flex flex-col">
            <div className="flex items-center mb-8">
              <div className="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {isEditing ? 'Edit Comfort Track' : 'Add Comfort Track'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Music Link (YouTube/Spotify) *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="trackUrl"
                    value={form.trackUrl}
                    onChange={handleChange}
                    placeholder="Paste YouTube or Spotify link here"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 pr-24"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleFetchData}
                    disabled={isFetchingData || !form.trackUrl}
                    className="absolute right-2 top-2 px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isFetchingData ? 'Fetching...' : 'Auto-fill'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Paste a YouTube or Spotify link to automatically fill the details below
                </p>
              </div>

              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="What's this comforting track called?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Artist
                </label>
                <input
                  type="text"
                  name="artist"
                  value={form.artist}
                  onChange={handleChange}
                  placeholder="Who created this musical comfort?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  name="coverUrl"
                  value={form.coverUrl}
                  onChange={handleChange}
                  placeholder="Paste an image link for album/cover art"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
                
                {form.coverUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cover preview:</p>
                    <img 
                      src={form.coverUrl} 
                      alt="Cover preview" 
                      className="h-20 w-20 object-cover rounded-md border border-gray-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${isSubmitting 
                    ? 'bg-purple-400 dark:bg-purple-600 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 shadow-md hover:shadow-lg'} text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditing ? 'Updating Track...' : 'Saving Your Comfort Track...'}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {isEditing ? 'Update Track' : 'Add to Sound Collection'}
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => navigate('/sound-corner')}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Music Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTrack;