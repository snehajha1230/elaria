import React from 'react';
import { 
  FaLeaf, 
  FaHeartbeat, 
  FaBrain, 
  FaRegMoon, 
  FaRegSun, 
  FaWind, 
  FaWater,
  FaSeedling,
  FaPeace,
  FaSpinner
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const MindfulnessPage = () => {
  const benefits = [
    {
      title: "Reduces Stress & Anxiety",
      description: "Regular practice lowers cortisol levels and activates the parasympathetic nervous system, helping your body and mind relax.",
      icon: <FaWind className="text-3xl text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Improves Focus & Clarity",
      description: "Strengthens your attention span and helps filter out distractions by training your mind to stay present.",
      icon: <FaBrain className="text-3xl text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Enhances Emotional Well-being",
      description: "Creates space between stimulus and response, allowing you to navigate emotions with greater awareness and balance.",
      icon: <FaHeartbeat className="text-3xl text-pink-500" />,
      color: "bg-pink-50 dark:bg-pink-900/20"
    },
    {
      title: "Promotes Better Sleep",
      description: "Calms the nervous system and quiets mental chatter, making it easier to fall asleep and stay asleep.",
      icon: <FaRegMoon className="text-3xl text-indigo-500" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      title: "Increases Self-Awareness",
      description: "Helps you observe thoughts and patterns without judgment, leading to greater self-understanding.",
      icon: <FaRegSun className="text-3xl text-yellow-500" />,
      color: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      title: "Boosts Resilience",
      description: "Builds your capacity to handle life's challenges with more ease and less reactivity.",
      icon: <FaLeaf className="text-3xl text-green-500" />,
      color: "bg-green-50 dark:bg-green-900/20"
    }
  ];

  const yogaPoses = [
    {
      name: "Mountain Pose",
      benefit: "Grounding & Centering",
      description: "Stand tall, feet rooted like a mountain. Improves posture and brings mental clarity.",
      icon: <FaSeedling className="text-3xl text-amber-500" />
    },
    {
      name: "Child's Pose",
      benefit: "Relaxation & Surrender",
      description: "A resting pose that calms the mind and gently stretches the back.",
      icon: <FaLeaf className="text-3xl text-teal-500" />
    },
    {
      name: "Tree Pose",
      benefit: "Balance & Focus",
      description: "Improves concentration while strengthening legs and core.",
      icon: <FaPeace className="text-3xl text-emerald-500" />
    }
  ];

  const meditationTechniques = [
    {
      name: "Breath Awareness",
      steps: [
        "Find a comfortable seated position",
        "Close your eyes and relax your body",
        "Notice the natural rhythm of your breath",
        "When your mind wanders, gently return to the breath",
        "Start with 5 minutes, gradually increasing time"
      ],
      icon: <FaWater className="text-3xl text-blue-400" />
    },
    {
      name: "Body Scan",
      steps: [
        "Lie down comfortably on your back",
        "Bring attention to your toes",
        "Slowly move awareness up through each body part",
        "Notice sensations without judgment",
        "Release tension as you go"
      ],
      icon: <FaSpinner className="text-3xl text-purple-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-teal-200/30 dark:bg-teal-800/20 blur-xl"></div>
        <div className="absolute bottom-1/4 right-20 w-40 h-40 rounded-full bg-blue-200/30 dark:bg-blue-800/20 blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            whileHover={{ rotate: 5 }}
            className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-sm mb-6"
          >
            <FaLeaf className="text-4xl text-teal-600 dark:text-teal-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
            Mindful Living
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover how meditation and yoga can transform your mental health and bring peace to your daily life
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-16"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg">
              In our fast-paced world, mindfulness practices like meditation and yoga offer an oasis of calm for our overstimulated minds. These ancient techniques, now backed by modern science, help us cultivate presence, reduce stress, and develop a healthier relationship with our thoughts and emotions.
            </p>
            <p className="text-lg">
              Whether you have five minutes or an hour, incorporating these practices into your routine can lead to profound changes in your mental well-being, emotional resilience, and overall quality of life.
            </p>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
            The Benefits of Mindfulness
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`${item.color} rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700`}
              >
                <div className="flex items-center mb-4">
                  {item.icon}
                  <h3 className="text-xl font-semibold ml-3">{item.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Yoga Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
              Yoga for Mental Health
            </h2>
            <p className="text-lg text-center mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
              Yoga combines physical postures, breathwork, and meditation to create harmony between body and mind. These beginner-friendly poses can help calm your nervous system:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {yogaPoses.map((pose, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center mb-3">
                    {pose.icon}
                    <h3 className="text-xl font-semibold ml-3">{pose.name}</h3>
                  </div>
                  <p className="font-medium text-teal-600 dark:text-teal-400 mb-2">{pose.benefit}</p>
                  <p className="text-gray-600 dark:text-gray-400">{pose.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Meditation Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
            Simple Meditation Techniques
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {meditationTechniques.map((technique, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-6">
                  {technique.icon}
                  <h3 className="text-2xl font-semibold ml-3">{technique.name}</h3>
                </div>
                <ol className="space-y-3 pl-5">
                  {technique.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-teal-600 dark:text-teal-400">{stepIndex + 1}.</span> {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing Inspiration */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
        >
          <FaLeaf className="text-4xl mx-auto text-teal-600 dark:text-teal-400 mb-4" />
          <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Begin Your Journey
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Remember, mindfulness is a practice, not perfection. Start with just a few minutes each day, and be gentle with yourself as you develop these life-changing habits.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MindfulnessPage;