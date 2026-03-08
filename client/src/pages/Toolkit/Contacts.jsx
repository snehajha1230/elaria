import React, { useState, useEffect } from 'react';
import axios from '../../utils/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaUserPlus, FaTrash, FaPhone, FaEnvelope, FaUser, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      const res = await axios.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      toast.error('Failed to load contacts');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (contacts.length >= 4) {
        return toast.error('You can only add up to 4 emergency contacts');
      }

      const res = await axios.post('/contacts', form);
      setContacts([...contacts, res.data]);
      setForm({ name: '', email: '', phone: '' });
      setIsAdding(false);
      toast.success('Contact added to your safety network');
    } catch (err) {
      toast.error('Failed to add contact');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/contacts/${id}`);
      setContacts(contacts.filter((c) => c._id !== id));
      toast.success('Contact removed from your network');
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100 dark:bg-blue-900/20 opacity-30 blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-indigo-100 dark:bg-indigo-900/20 opacity-30 blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
            {/* Home Icon */}
            <motion.button
              onClick={() => navigate('/support')}
              whileHover={{ scale: 2 }}
              whileTap={{ scale: 1.2 }}
              className="absolute top-3 left-3 p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Home"
            >
              <FaHome className="text-xl" />
            </motion.button>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Your Safety Network
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Add trusted contacts who will be notified when you need urgent help. 
            These are the people who will receive your SOS alerts.
          </p>
        </motion.div>

        
        {/* Add Contact Button */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl shadow-sm transition-all ${isAdding 
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-md'}`}
          >
            <FaUserPlus />
            <span>{isAdding ? 'Cancel' : 'Add New Contact'}</span>
          </motion.button>
        </motion.div>

        {/* Add Contact Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-10 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUserPlus className="mr-2 text-blue-500" />
              Add Emergency Contact
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Contact Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="contact@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(123) 456-7890"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
                >
                  Save Contact
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Contacts List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <span className="bg-blue-100 dark:bg-blue-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
              <FaUser className="text-blue-500 dark:text-blue-400" />
            </span>
            Your Trusted Contacts ({contacts.length}/4)
          </h2>

          {contacts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <FaUserPlus className="text-blue-500 dark:text-blue-400 text-2xl" />
              </div>
              <h3 className="text-xl font-medium mb-2">No contacts added yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your emergency contacts will appear here once you add them.
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add First Contact
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                          <FaUser className="text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold">{contact.name}</h3>
                      </div>

                      {contact.email && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                          <FaEnvelope className="mr-2 text-blue-500" />
                          <span>{contact.email}</span>
                        </div>
                      )}

                      {contact.phone && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <FaPhone className="mr-2 text-blue-500" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(contact._id)}
                      className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Remove contact"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Safety Tips */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50"
        >
          <h3 className="text-xl font-semibold mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Safety Tips
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Choose contacts who are typically available and responsive
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Make sure at least one contact lives nearby
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Inform your contacts that they're part of your safety network
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              Update your contacts if their information changes
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Contacts;