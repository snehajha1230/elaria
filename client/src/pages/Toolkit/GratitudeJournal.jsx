import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaRegLightbulb, FaSeedling, FaRegSmile, FaHeart, FaSyncAlt, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GratitudeJournal = () => {
  const [currentContent, setCurrentContent] = useState({});
  const navigate = useNavigate();

  const motivationalQuotes = [
    {
      quote: "Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order, confusion into clarity.",
      author: "Melody Beattie",
      lesson: "When we practice gratitude, we shift our focus from what's missing to what's present. This simple act of appreciation can transform our entire outlook on life, helping us find contentment in the present moment while opening our hearts to receive more abundance."
    },
    {
      quote: "The more grateful I am, the more beauty I see.",
      author: "Mary Davis",
      lesson: "Gratitude acts like a lens that magnifies the beauty in our everyday lives. As we cultivate thankfulness, we begin to notice small wonders we previously overlooked - the warmth of sunlight, a kind word from a stranger, or the comfort of a familiar routine."
    },
    {
      quote: "Gratitude is the healthiest of all human emotions. The more you express gratitude for what you have, the more likely you will have even more to express gratitude for.",
      author: "Zig Ziglar",
      lesson: "Scientific studies show that gratitude practice can improve sleep, reduce stress, and strengthen relationships. By regularly acknowledging our blessings, we create a positive feedback loop that attracts more good into our lives while improving our mental and physical wellbeing."
    },
    {
      quote: "When I started counting my blessings, my whole life turned around.",
      author: "Willie Nelson",
      lesson: "Even in difficult times, focusing on what's going right can provide perspective and hope. Making a habit of 'counting blessings' rewires our brain to naturally spot the positive, making us more resilient in facing life's challenges."
    },
    {
      quote: "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.",
      author: "Anonymous",
      lesson: "Looking back with gratitude helps us see how every experience contributed to our growth. Being grateful today grounds us in appreciation, and maintaining gratitude gives us faith that good things will continue to come our way."
    },
    {
      quote: "Happiness cannot be traveled to, owned, earned, worn or consumed. Happiness is the spiritual experience of living every minute with love, grace, and gratitude.",
      author: "Denis Waitley",
      lesson: "True happiness isn't found in external achievements but in how we choose to experience each moment. When we approach life with gratitude, we discover that joy exists not in having what we want, but in wanting what we have."
    },
    {
      quote: "Enjoy the little things, for one day you may look back and realize they were the big things.",
      author: "Robert Brault",
      lesson: "Life's most precious moments often come in small packages - a shared laugh, a quiet morning, a helping hand. When we learn to appreciate these everyday gifts, we build a reservoir of joy that sustains us through life's ups and downs."
    },
    {
      quote: "Gratitude is not only the greatest of virtues, but the parent of all others.",
      author: "Cicero",
      lesson: "From gratitude springs generosity, kindness, patience, and compassion. When we're truly grateful, we naturally want to share our blessings with others, creating ripples of positivity that extend far beyond ourselves."
    }
  ];

  const upliftingMessages = [
    {
      title: "The Power of Perspective",
      content: "Your current circumstances don't define your future. Every challenge contains seeds of opportunity - it's all about how you choose to view it. Today, try reframing one difficulty as a chance to grow.",
      icon: <FaRegLightbulb className="text-3xl text-yellow-500" />,
      color: "from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20"
    },
    {
      title: "Small Steps, Big Changes",
      content: "Don't underestimate the power of small, consistent actions. Like drops of water that eventually fill a bucket, your daily positive choices are compounding into something remarkable.",
      icon: <FaSeedling className="text-3xl text-green-500" />,
      color: "from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20"
    },
    {
      title: "Your Light Matters",
      content: "The world needs your unique gifts. Even when you don't feel extraordinary, remember that your presence makes a difference in ways you may never fully realize.",
      icon: <FaRegSmile className="text-3xl text-blue-500" />,
      color: "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20"
    },
    {
      title: "Resilience in Action",
      content: "Every time you choose hope over despair, you're strengthening your ability to bounce back. These moments of courage are building your inner fortitude for whatever comes next.",
      icon: <FaHeart className="text-3xl text-red-500" />,
      color: "from-rose-100 to-rose-50 dark:from-rose-900/30 dark:to-rose-800/20"
    },
    {
      title: "Present Moment Gift",
      content: "Right now, in this moment, you have everything you need. The past is gone, the future isn't here yet - but this present moment is full of possibilities waiting to be noticed.",
      icon: <FaRegLightbulb className="text-3xl text-purple-500" />,
      color: "from-violet-100 to-violet-50 dark:from-violet-900/30 dark:to-violet-800/20"
    }
  ];

  useEffect(() => {
    setRandomContent();
  }, []);

  const setRandomContent = () => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    const randomMessage = upliftingMessages[Math.floor(Math.random() * upliftingMessages.length)];
    setCurrentContent({ quote: randomQuote, message: randomMessage });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-[#0f172a] dark:to-[#1e293b] text-gray-800 dark:text-gray-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-blue-200/20 dark:bg-blue-900/10 opacity-30 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full bg-purple-200/20 dark:bg-purple-900/10 opacity-30 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 shadow-sm mb-6"
          >
            <FaQuoteLeft className="text-indigo-600 dark:text-indigo-400" size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Daily Inspiration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Refresh your spirit with uplifting wisdom and positive perspectives
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Quote Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col items-center text-center">
              <FaQuoteLeft className="text-indigo-500/30 dark:text-indigo-400/30 mb-6" size={40} />
              <p className="text-2xl md:text-3xl font-light italic mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                "{currentContent.quote?.quote}"
              </p>
              <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                — {currentContent.quote?.author}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={setRandomContent}
                className="mt-8 px-5 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-300 rounded-xl font-medium flex items-center gap-2 hover:shadow-md transition-all"
              >
                <FaSyncAlt />
                New Inspiration
              </motion.button>
            </div>
          </motion.div>

          {/* Life Lesson */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
              Life Lesson
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p>{currentContent.quote?.lesson}</p>
            </div>
          </motion.div>

          {/* Uplifting Message */}
          {currentContent.message && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`bg-gradient-to-r ${currentContent.message.color} backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700`}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex-shrink-0">
                  {currentContent.message.icon}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                    {currentContent.message.title}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {currentContent.message.content}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Refresh the page or click "New Inspiration" for more motivational content</p>
        </motion.div>
      </div>
    </div>
  );
};

export default GratitudeJournal;