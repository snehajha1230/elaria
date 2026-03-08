import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, LogOut, Sparkles, Feather, Shield, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    
    // Simulate cozy loading experience
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const features = [
    {
      id: 'comfort',
      title: 'Calm Cove',
      subtitle: 'Wrap yourself in digital serenity',
      description:
        'Curate your perfect peaceful space with soft lighting, favorite sounds, and comforting visuals. Your personal retreat from the world.',
      image: 'https://i.pinimg.com/1200x/26/50/36/265036995729086336085084d17ceda2.jpg',
      icon: <Feather className="w-6 h-6" />,
      darkColor: 'from-amber-900/20 to-amber-900/40',
      onClick: () => navigate('/comfort-space'),
    },
    {
      id: 'help',
      title: 'Safe Harbor',
      subtitle: 'Real people ready to listen',
      description:
        'Connect with compassionate listeners in our candlelit digital space. Share as much or as little as you need - no pressure, just presence.',
      image: 'https://i.pinimg.com/736x/bc/d1/84/bcd184094f180c0649317dbc13b748ba.jpg',
      icon: <Shield className="w-6 h-6" />,
      darkColor: 'from-blue-900/20 to-blue-900/40',
      onClick: () => navigate('/support'),
    },
    {
      id: 'ai',
      title: 'Elaria AI',
      subtitle: 'Gentle conversation anytime',
      description:
        'Our AI companion speaks in soft tones, remembers your favorite tea, and creates a space where you can simply be.',
      image: 'https://i.pinimg.com/736x/32/e5/1e/32e51e243e3ffeb08b85ca80480fb883.jpg',
      icon: <Coffee className="w-6 h-6" />,
      darkColor: 'from-violet-900/20 to-violet-900/40',
      onClick: () => navigate('/ai-companion'),
    },
  ];

  // Background particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 2,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.3 + 0.1,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 15,
    blur: Math.random() * 4 + 2
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="mx-auto w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-amber-300 font-serif"
          >
            Preparing your cozy space...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950 text-amber-50">
      
      {/* Soft glowing cursor trail */}
      <motion.div 
        className="fixed z-0 pointer-events-none rounded-full"
        animate={{
          x: cursorPosition.x - 20,
          y: cursorPosition.y - 20,
          opacity: [0, 0.2, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ 
          x: { type: "spring", damping: 20, stiffness: 200 },
          y: { type: "spring", damping: 20, stiffness: 200 },
          opacity: { duration: 1.5, repeat: Infinity },
          scale: { duration: 1.5, repeat: Infinity }
        }}
        style={{
          width: 40,
          height: 40,
          background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, rgba(251,191,36,0) 70%)'
        }}
      />
      
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-amber-300/30"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: particle.left,
              top: particle.top,
              opacity: particle.opacity,
              filter: `blur(${particle.blur}px)`
            }}
            initial={{ y: -20 }}
            animate={{ 
              y: [0, -20, 0],
              x: [0, Math.random() * 40 - 20, 0]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>

      {/* Soft glowing corners */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl bg-amber-900/20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-blue-900/20"></div>
      </div>

      {/* Subtle page texture */}
      <div className="fixed inset-0 pointer-events-none opacity-5" style={{
        backgroundImage: 'radial-gradient(circle, rgba(251,191,36,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>

      {/* Navigation - Cozy bookshelf style */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 group"
          >
            <div className="p-2 rounded-lg bg-amber-900/30 group-hover:bg-amber-900/50 transition">
              <HomeIcon className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-serif text-xl font-bold text-amber-400 hidden sm:block">Elaria</span>
          </motion.button>

          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full bg-gray-800 transition shadow-sm"
            >
              <span className="text-sm md:text-md font-medium">
                Welcome home, {user?.name ? `${user.name.split(' ')[0]}` : 'friend'} <span className="text-amber-400">✧</span>
              </span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span className="text-rose-500 font-medium hidden sm:inline">Sign out</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Warm embrace */}
      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-12 mb-16 px-4"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-amber-900/30 shadow-sm"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">
              A sanctuary crafted just for you
            </span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Come in, <span className="text-amber-400">make yourself at home</span>
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Elaria is your digital hearth - where the fire is always lit, the chair is always comfortable, and you're always welcome.
          </motion.p>
        </motion.section>

        {/* Features - Comfortable seating options */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ y: -10 }}
              onHoverStart={() => setActiveFeature(feature.id)}
              onHoverEnd={() => setActiveFeature(null)}
              onClick={feature.onClick}
              className="relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 shadow-xl bg-gray-900/70 backdrop-blur-sm border border-gray-800 hover:shadow-2xl"
            >
              <div className="relative h-80 overflow-hidden">
                <motion.img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover"
                  animate={{
                    scale: activeFeature === feature.id ? 1.1 : 1,
                    filter: activeFeature === feature.id ? 'brightness(1.1)' : 'brightness(0.9)'
                  }}
                  transition={{ duration: 0.5 }}
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${feature.darkColor} opacity-90`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50"></div>
              </div>
              
              <div className="p-6 relative z-10">
                <motion.div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gray-800/50 shadow-sm backdrop-blur-sm"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <motion.h2 
                  className="text-2xl font-serif font-bold mb-2"
                  whileHover={{ x: 2 }}
                >
                  {feature.title}
                </motion.h2>
                <motion.h3 
                  className="text-md text-amber-300 mb-3 font-medium"
                  whileHover={{ x: 2 }}
                >
                  {feature.subtitle}
                </motion.h3>
                <motion.p 
                  className="mb-6 text-gray-300 font-serif"
                  whileHover={{ x: 2 }}
                >
                  {feature.description}
                </motion.p>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                >
                  <span className="font-semibold text-amber-300 font-serif">
                    Find your space
                  </span>
                  <motion.svg 
                    className="w-5 h-5 ml-2 text-amber-300"
                    animate={{ 
                      x: activeFeature === feature.id ? 5 : 0
                    }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </motion.svg>
                </motion.div>
              </div>
              
              {/* Subtle feature glow */}
              {activeFeature === feature.id && (
                <motion.div 
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: 'radial-gradient(circle at center, rgba(251,191,36,0.3) 0%, transparent 70%)'
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Comforting footer */}
        <motion.footer 
          className="text-center py-8 border-t border-gray-800 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-gray-400 font-serif text-lg">
            "A house is made of walls and beams; a home is built with love and dreams." <span className="text-amber-400">✧</span>
          </p>
        </motion.footer>
      </main>

      {/* Ambient light based on active feature */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div 
            className="fixed inset-0 pointer-events-none z-0 bg-gray-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;