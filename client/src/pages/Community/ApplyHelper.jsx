import React, { useState } from 'react';
import axios from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ApplyHelper = () => {
  const [form, setForm] = useState({
    role: '',
    bio: '',
  });

  const navigate = useNavigate();

  const roles = [
    { value: 'Listener', description: 'Provide empathetic listening and emotional support' },
    { value: 'Psychology Student', description: 'Share academic knowledge and practical insights' },
    { value: 'Professional', description: 'Offer professional guidance and therapeutic support' }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.role || !form.bio) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const res = await axios.post('/helpers/apply', form);
      toast.success('Application submitted successfully!');
      navigate('/support');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute top-4 left-4">
                  {/* Home Icon */}
                        <motion.button
                          onClick={() => navigate('/support')}
                          whileHover={{ scale: 2 }}
                          whileTap={{ scale: 1.2 }}
                          className="absolute top-0 left-0 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                          aria-label="Home"
                        >
                          <FaHome className="text-xl" />
                        </motion.button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Appreciation Content */}
            <div className="w-full md:w-2/5 bg-gradient-to-b from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 p-8 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Your Compassion Makes a Difference</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-500 dark:bg-blue-700 bg-opacity-30 p-4 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Why Your Help Matters</h3>
                      <p className="text-blue-100">
                        Every person who steps forward to help creates ripples of positive change. 
                        Your willingness to support others is a gift that can transform lives.
                      </p>
                    </div>
                    
                    <div className="bg-blue-500 dark:bg-blue-700 bg-opacity-30 p-4 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">The Impact You'll Have</h3>
                      <p className="text-blue-100">
                        As a helper, you'll provide comfort, guidance, and hope to those who need it most. 
                        Your time and expertise can be the turning point in someone's journey.
                      </p>
                    </div>
                    
                    <div className="bg-blue-500 dark:bg-blue-700 bg-opacity-30 p-4 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Our Community</h3>
                      <p className="text-blue-100">
                        You'll join a network of caring individuals dedicated to making mental health 
                        support accessible to all. Together, we're building a kinder world.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 border-t border-blue-400 pt-6">
                  <blockquote className="italic text-blue-200">
                    "No one is useless in this world who lightens the burdens of another."
                    <footer className="mt-2 not-italic font-medium">— Charles Dickens</footer>
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Right Side - Application Form */}
            <div className="w-full md:w-3/5 p-8">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Helper Application</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Complete this form to join our support network
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select your preferred role
                    </label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">-- Select a role --</option>
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.value} - {r.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Personal introduction
                    </label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Share your background, experience, and what motivates you to help others..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      This will be visible to those seeking support when choosing a helper.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-150 ease-in-out"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Thank you for considering this opportunity to make a difference. 
                    We review applications carefully and will respond within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyHelper;