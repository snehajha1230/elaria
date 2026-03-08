import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/api';
import { toast } from 'react-toastify';

const AddPoem = () => {
  const location = useLocation();
  const poemToEdit = location.state?.poemToEdit;
  
  const [form, setForm] = useState({
    title: '',
    author: '',
    linkUrl: '',
    content: ''
  });

  const [inputMethod, setInputMethod] = useState('link'); // 'link' or 'text'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (poemToEdit) {
      setForm({
        title: poemToEdit.title,
        author: poemToEdit.author || '',
        linkUrl: poemToEdit.linkUrl || '',
        content: poemToEdit.content || ''
      });
      
      // Determine input method based on what data exists
      if (poemToEdit.content) {
        setInputMethod('text');
      } else {
        setInputMethod('link');
      }
      
      setIsEditing(true);
    }
  }, [poemToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInputMethodChange = (method) => {
    setInputMethod(method);
    // Clear the other field when switching methods
    if (method === 'link') {
      setForm({...form, content: ''});
    } else {
      setForm({...form, linkUrl: ''});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to share your poetry');
      setIsSubmitting(false);
      return;
    }

    // Validate that at least one method is provided
    if (!form.linkUrl && !form.content) {
      toast.error('Please provide either a link or write your poem');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`/poems/${poemToEdit._id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Poem updated successfully!');
      } else {
        await axios.post('/poems', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Your poem has been added to the collection!');
      }
      navigate('/poetry');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong while saving your poem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-rose-900/30">
      <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Panel - Poetic Inspiration */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-rose-800 to-pink-900 dark:from-rose-900/90 dark:to-pink-900/80 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "url('https://i.pinimg.com/1200x/f4/b3/20/f4b3207a71e8e0d102befd6060cd85f8.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-300 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-3xl font-serif font-bold text-rose-100">
                    Poetry Room
                  </h2>
                </div>
                <div className="w-16 h-1 bg-rose-400 mb-4"></div>
                <p className="text-rose-200 italic font-serif text-lg leading-relaxed">
                  "Poetry is when an emotion has found its thought and the thought has found words."<br />
                  <span className="text-rose-300">— Robert Frost</span>
                </p>
              </div>
              
              <div className="relative mt-8">
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-rose-600/20 rounded-full"></div>
                <div className="relative bg-white/10 dark:bg-black/20 p-6 rounded-lg backdrop-blur-sm border border-rose-300/20">
                  <h3 className="font-serif font-bold text-rose-100 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Poetry Tip
                  </h3>
                  <p className="text-sm text-rose-200">
                    The best poems often come from personal moments. Don't hesitate to share what moves you.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-auto pt-4 border-t border-rose-700/50">
              <p className="text-xs text-rose-300/80">
                <span className="font-semibold">Note:</span> Your collection becomes a personalized auditory retreat.
              </p>
            </div>
          </div>

          {/* Right Panel - Add Poem Form */}
          <div className="w-full md:w-3/5 bg-white dark:bg-gray-800 p-8 flex flex-col">
            <div className="flex items-center mb-8">
              <div className="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {isEditing ? 'Edit Your Poem' : 'Share Your Poem'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="What shall we call this poem?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:focus:ring-rose-400 dark:focus:border-rose-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  Author
                </label>
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Who wrote these beautiful words?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:focus:ring-rose-400 dark:focus:border-rose-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Input Method Selection */}
              <div className="group">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  How would you like to share your poem? *
                </label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleInputMethodChange('link')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      inputMethod === 'link'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Share a Link
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputMethodChange('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      inputMethod === 'text'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Write Poem
                  </button>
                </div>
                
                {inputMethod === 'link' ? (
                  <>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      Poem or Article Link
                    </label>
                    <input
                      name="linkUrl"
                      type="url"
                      value={form.linkUrl}
                      onChange={handleChange}
                      placeholder="Where can we find the full poem?"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:focus:ring-rose-400 dark:focus:border-rose-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </>
                ) : (
                  <>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      Your Poem *
                    </label>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      required={inputMethod === 'text'}
                      rows="6"
                      placeholder="Write your beautiful poem here..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:focus:ring-rose-400 dark:focus:border-rose-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                    />
                  </>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${isSubmitting 
                    ? 'bg-rose-400 dark:bg-rose-600 cursor-not-allowed' 
                    : 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 shadow-md hover:shadow-lg'} text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditing ? 'Updating Your Poem...' : 'Preserving Your Words...'}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {isEditing ? 'Update Poem' : 'Add to Poetry Collection'}
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => navigate('/poetry')}
                className="text-sm text-rose-600 dark:text-rose-400 hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Poetry Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPoem;