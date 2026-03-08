import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaUserCheck,FaRegCommentDots, FaExclamationTriangle, FaPenFancy,FaTrashAlt, FaStickyNote, FaMusic, FaFilm, FaBook, FaPenAlt, FaEnvelope, FaHandsHelping, FaRobot, FaLeaf, FaUserCircle, FaSmile, FaBell, FaWind, FaMedal, FaHandHoldingHeart, FaSearch, FaUserFriends, FaPhoneAlt, FaFirstAid, FaHome, FaCouch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  const features = [
    {
      category: "Calm Clove",
      color: "bg-blue-50 border-blue-100 text-blue-900",
      iconColor: "text-blue-600",
      items: [
        { icon: <FaMusic />, title: "Music Room", desc: "Build personal comfort playlists with soul-soothing melodies" },
        { icon: <FaFilm />, title: "Screen Room", desc: "Curate comforting films and shows that feel like a warm blanket" },
        { icon: <FaPenFancy />, title: "Poetry Room", desc: "Gentle verses with space to save those that touch your soul" },
        { icon: <FaBook />, title: "Reading Room", desc: "Your digital library filled with comforting books" },
        { icon: <FaTrashAlt />, title: "Let-Go Space", desc: "Private space to pour out your heart with release options" },
        { icon: <FaStickyNote />, title: "Diary Space", desc: "Compose heartfelt letters to your past, present or future self" },
        { icon: <FaUserFriends />, title: "Friends Community", desc: "Add friends and visit their public rooms in view-only mode to share comfort spaces" }
      ]
    },
    {
      category: "Safe Harbor",
      color: "bg-indigo-50 border-indigo-100 text-indigo-900",
      iconColor: "text-indigo-600",
      items: [
        { icon: <FaBell />, title: "Notifications", desc: "Receive gentle notifications and updates of your chat request from your support circle" },
        { icon: <FaUserCheck />, title: "Emergency Contacts", desc: "Add your trusted contacts" },
        { icon: <FaWind />, title: "Breathe", desc: "Guided breathing exercises for heavy moments or panic attacks" },
        { icon: <FaLeaf />, title: "Self Check", desc: "Diagnose yourself with clinically tested forms to know and access yourself" },
        { icon: <FaHandHoldingHeart />, title: "Gratitude", desc: "Nurture daily inspiration, a quote, life lesson and a key takeaway for life" },
        { icon: <FaSmile />, title: "Mood", desc: "Track your emotions and reflect on your day" },
        { icon: <FaSearch />, title: "Find Support", desc: "Find understanding professionals or kindred spirits" },
        { icon: <FaUserFriends />, title: "Become a Helper", desc: "Share your warmth by supporting others" },
        { icon: <FaExclamationTriangle />, title: "SOS Button", desc: "Notify your saved emergency contacts in case of urgent need" }
      ]
    },
    {
      category: "Elaria AI",
      color: "bg-amber-50 border-amber-100 text-amber-900",
      iconColor: "text-amber-600",
      items: [
        { icon: <FaLeaf />, title: "Gentle Presence", desc: "Listens with patience and heartfelt understanding" },
        { icon: <FaRegCommentDots />, title: "Safe Space", desc: "Share your thoughts freely in a private, non-judgmental space" },
        { icon: <FaUserCircle />, title: "Always Here", desc: "24/7 companionship for lonely moments" },
      ]
    }
  ];

  // Create an array of leaves with different properties
  const leaves = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: `${0.5 + Math.random() * 1}rem`,
    rotation: Math.random() * 360,
    opacity: 0.7 + Math.random() * 0.3
  }));

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Falling leaves */}
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute text-green-600"
            style={{
              left: leaf.left,
              top: '-5%',
              fontSize: leaf.size,
              opacity: leaf.opacity,
              rotate: leaf.rotation
            }}
            initial={{ y: -50, x: 0 }}
            animate={{ 
              y: ['-5%', '105vh'],
              x: [0, Math.random() * 100 - 50],
              rotate: [leaf.rotation, leaf.rotation + 360]
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <FaLeaf />
          </motion.div>
        ))}

        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100/20 blur-3xl"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, 15, 0], 
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }} 
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-indigo-100/20 blur-3xl"
          animate={{ 
            x: [0, -15, 0], 
            y: [0, 10, 0], 
            scale: [1, 1.05, 1] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }} 
        />
        <motion.div 
          className="absolute top-2/3 left-1/3 w-56 h-56 rounded-full bg-amber-100/20 blur-3xl"
          animate={{ 
            x: [0, 10, -5, 0], 
            y: [0, -10, 5, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }} 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-full mb-6 shadow-lg"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <FaHome className="text-3xl text-blue-600" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black leading-tight">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Elaria</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Your gentle space to breathe, feel, and be understood, all in one place.
          </p>
        </motion.div>

        {/* Introduction Flow */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }} 
          className="mb-20"
        >
          <div className="space-y-8">
            <motion.div 
              className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-3xl border border-amber-200 shadow-lg"
              initial={{ x: -20 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-white p-2 rounded-full mr-4 shadow-sm">
                  <FaHeart className="text-amber-600 text-xl" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">What Makes Elaria Special?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                At Elaria, we bring together personal comfort tools, supportive circles, and a kind hearted AI to create a space that truly listens. More than just a wellness app, Elaria gently adapts to your emotional rhythm, offering warmth and understanding throughout your day.
                Let us now walk together through Elaria's three core features each crafted to comfort, connect, and care for you in your own unique way.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Flowing Feature Showcase */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }} 
          className="mb-24 space-y-16"
        >
          {features.map((section, sectionIndex) => (
            <motion.div 
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
              className={`p-8 rounded-3xl ${section.color} border shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              <div className="flex items-center mb-8">
                <div className={`p-4 rounded-xl mr-4 ${section.iconColor} bg-white shadow-md`}>
                  {sectionIndex === 0 ? <FaCouch className="text-2xl" /> : 
                   sectionIndex === 1 ? <FaHandsHelping className="text-2xl" /> : 
                   <FaRobot className="text-2xl" />}
                </div>
                <h2 className="text-3xl font-bold">{section.category}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-300"
                  >
                    <div className="flex items-start mb-3">
                      <div className={`p-3 rounded-lg mr-4 ${section.iconColor} bg-opacity-20`}>
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-gray-700 text-sm pl-14">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ duration: 1 }} 
          viewport={{ once: true }} 
          className="text-center"
        >
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-amber-50 rounded-3xl p-10 shadow-inner border border-gray-200 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-100/30 blur-xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-amber-100/30 blur-xl"></div>
            
            <motion.div 
              className="inline-flex items-center justify-center bg-white p-5 rounded-full mb-6 shadow-lg"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaHeart className="text-4xl text-blue-600" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-6 text-black">Ready to Find Your Comfort?</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Step into Elaria, where your well being begins its journey.
            </p>
             <motion.button 
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
                background: "linear-gradient(to right, #3b82f6, #6366f1)"
              }} 
              whileTap={{ scale: 0.98 }} 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              onClick={() => navigate('/signup')}
            >
              <span className="relative z-10">Begin Your Journey</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ELARIA</span>
              </h3>
              <p className="text-gray-400">Your emotional comfort ecosystem</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">Connect With Us</h4>
              <p className="text-gray-400 mb-2 flex items-center hover:text-white transition-colors duration-300">
                <FaEnvelope className="mr-2 text-blue-400" /> elaria1230@gmail.com
              </p>
              <p className="text-gray-400">
                Created with care by Sneha Jha
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} ELARIA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;