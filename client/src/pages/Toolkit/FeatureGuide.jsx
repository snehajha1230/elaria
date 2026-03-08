import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSmile,
  FaBell,
  FaWind,
  FaLeaf,
  FaBookOpen,
  FaUserFriends,
  FaHandsHelping,
  FaComments,
  FaStethoscope,
  FaUserShield,
  FaExclamationTriangle,
  FaQuestionCircle
} from 'react-icons/fa';

const FeatureGuide = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaSmile className="text-3xl text-[#7c4dff]" />,
      title: "Mood Tracker",
      description: "Your emotional journal that helps you recognize patterns and celebrate progress.",
      howToUse: [
        "Tap the smiley icon to select your current mood",
        "Add a brief note about what's affecting your mood",
        "View your mood history to see emotional patterns over time",
        "Set gentle reminders to check in with yourself"
      ],
      benefits: [
        "Increased self-awareness of emotional states",
        "Helps identify triggers and coping strategies",
        "Provides valuable data for mental health professionals",
        "Celebrates small victories and progress"
      ],
      action: () => navigate('/mood-tracker')
    },
    {
      icon: <FaBell className="text-3xl text-[#5d78ff]" />,
      title: "Notifications",
      description: "Stay connected with real-time updates from your support network.",
      howToUse: [
        "Get instant alerts when helpers respond to your requests",
        "See upcoming check-in reminders",
        "Receive daily wellness prompts",
        "Customize notification preferences in settings"
      ],
      benefits: [
        "Never miss important support messages",
        "Stay engaged with your wellness journey",
        "Get gentle nudges for self-care activities",
        "Feel connected even when alone"
      ],
      action: () => navigate('/notifications')
    },
    {
      icon: <FaWind className="text-3xl text-[#00bcd4]" />,
      title: "Breathe",
      description: "Your portable panic button that helps restore calm in difficult moments.",
      howToUse: [
        "Tap when feeling anxious or overwhelmed",
        "Follow the visual guide to pace your breathing",
        "Choose duration (1-5 minutes)",
        "Combine with soothing background sounds"
      ],
      benefits: [
        "Quickly reduces physical symptoms of anxiety",
        "Helps break cycles of panic",
        "Grounds you in the present moment",
        "Portable tool you can use anywhere"
      ],
      action: () => navigate('/breathe')
    },
    {
      icon: <FaLeaf className="text-3xl text-[#4caf50]" />,
      title: "Meditate",
      description: "Gentle guidance for finding peace through mindfulness and movement.",
      howToUse: [
        "Select guided meditation or yoga sessions",
        "Choose duration based on your availability",
        "Follow along with voice instructions",
        "Track your consistency in the journal"
      ],
      benefits: [
        "Reduces stress and improves sleep",
        "Enhances emotional regulation",
        "Builds resilience over time",
        "Teaches self-compassion techniques"
      ],
      action: () => navigate('/meditate')
    },
    {
      icon: <FaBookOpen className="text-3xl text-[#9c27b0]" />,
      title: "Gratitude",
      description: "Daily doses of perspective and positivity to nurture hope.",
      howToUse: [
        "Read today's inspirational quote",
        "Reflect on the accompanying lesson",
        "Add your own grateful thoughts",
        "Refresh for new inspiration anytime"
      ],
      benefits: [
        "Shifts focus from problems to possibilities",
        "Builds positive neural pathways",
        "Counters negative thought patterns",
        "Creates habit of noticing good things"
      ],
      action: () => navigate('/gratitude')
    },
    {
      icon: <FaUserFriends className="text-3xl text-[#7c4dff]" />,
      title: "Find Support",
      description: "Connect with compassionate helpers ready to listen without judgment.",
      howToUse: [
        "Browse helper profiles with specialties",
        "Filter by availability or expertise",
        "Read reviews from other users",
        "Request a chat with your chosen helper"
      ],
      benefits: [
        "Immediate access to non-judgmental support",
        "Find helpers who understand your specific needs",
        "Safe space to share without fear",
        "Professional and peer options available"
      ],
      action: () => navigate('/find-support')
    },
    {
      icon: <FaHandsHelping className="text-3xl text-[#5d78ff]" />,
      title: "Become a Helper",
      description: "Transform your experiences into support for others.",
      howToUse: [
        "Complete the simple application form",
        "Specify your availability and strengths",
        "Complete brief training materials",
        "Start receiving chat requests"
      ],
      benefits: [
        "Give back from your own journey",
        "Help others while helping yourself",
        "Join a community of compassionate listeners",
        "Gain valuable interpersonal skills"
      ],
      action: () => navigate('/become-helper')
    },
    {
      icon: <FaComments className="text-3xl text-[#00bcd4]" />,
      title: "Chat Requests",
      description: "For helpers - meaningful connections waiting to happen.",
      howToUse: [
        "View incoming requests in your dashboard",
        "See brief context about the person's needs",
        "Accept requests matching your availability",
        "Begin real-time supportive conversation"
      ],
      benefits: [
        "Make direct impact when it matters most",
        "Flexible commitment on your schedule",
        "Built-in safety features and guidelines",
        "Option to specialize in certain areas"
      ],
      action: () => navigate('/chat-requests')
    },
    {
      icon: <FaStethoscope className="text-3xl text-[#4caf50]" />,
      title: "Self Check",
      description: "Gentle self-assessment to understand your needs.",
      howToUse: [
        "Answer simple questions about recent experiences",
        "Get personalized feedback about your responses",
        "Receive suggested resources and next steps",
        "Option to share results with your helpers"
      ],
      benefits: [
        "Helps articulate what you're experiencing",
        "Reduces uncertainty about seeking help",
        "Provides language to communicate needs",
        "Not a diagnosis but a starting point"
      ],
      action: () => navigate('/self-check')
    },
    {
      icon: <FaUserShield className="text-3xl text-[#9c27b0]" />,
      title: "Emergency Contacts",
      description: "Your personal safety net of trusted people.",
      howToUse: [
        "Add contacts who understand your needs",
        "Set permission levels for each contact",
        "Include notes about how they can best help",
        "Quick access in urgent situations"
      ],
      benefits: [
        "Peace of mind knowing help is reachable",
        "Contacts receive guidance on supporting you",
        "Customizable based on your preferences",
        "Integrates with SOS feature"
      ],
      action: () => navigate('/emergency-contacts')
    },
    {
      icon: <FaExclamationTriangle className="text-3xl text-[#ef5350]" />,
      title: "SOS Button",
      description: "Immediate help when you need it most.",
      howToUse: [
        "Tap when in urgent need of support",
        "Confirm to send alerts to your contacts",
        "Contacts receive your location and pre-written message",
        "Follow-up resources provided after use"
      ],
      benefits: [
        "Quick access in crisis situations",
        "Alerts multiple trusted people simultaneously",
        "Includes guidance for helpers responding",
        "Peace of mind safety net"
      ],
      action: () => navigate('/sos-info')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5ff] to-[#eaf6ff] dark:from-[#1a1a2e] dark:to-[#16213e] text-gray-800 dark:text-gray-100">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#d4e6f8]/40 dark:bg-[#8a9bff]/10 blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-[#e8dff5]/40 dark:bg-[#b39ddb]/10 blur-3xl"
          animate={{
            x: [0, -15, 0],
            y: [0, 10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#4a2c82] dark:text-white">
            Your Compassionate Companion
          </h1>
          <p className="text-xl text-[#5d5d5d] dark:text-gray-300 max-w-3xl mx-auto">
            Discover how each feature can support your mental health journey with gentle guidance.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-[#e2e8f0] dark:border-[#334155] hover:shadow-md transition-all cursor-pointer"
              onClick={feature.action}
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  {feature.icon}
                </div>
                <h2 className="text-2xl font-semibold text-[#4a2c82] dark:text-gray-200">
                  {feature.title}
                </h2>
              </div>
              <p className="text-[#5d5d5d] dark:text-gray-300 mb-4">
                {feature.description}
              </p>
              
              <div className="mb-4">
                <h3 className="font-medium text-[#7c4dff] dark:text-[#b39ddb] mb-2 flex items-center">
                  <FaQuestionCircle className="mr-2" /> How to Use
                </h3>
                <ul className="text-sm text-[#5d5d5d] dark:text-gray-300 space-y-1">
                  {feature.howToUse.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-[#4caf50] dark:text-[#81c784] mb-2">
                  Benefits
                </h3>
                <ul className="text-sm text-[#5d5d5d] dark:text-gray-300 space-y-1">
                  {feature.benefits.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#4a2c82] dark:text-white">
            Ready to Begin Your Healing Journey?
          </h2>
          <p className="text-xl text-[#5d5d5d] dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Each feature is designed with care to meet you where you are and support you where you want to go.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(124, 77, 255, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/home')}
            className="px-8 py-3 bg-gradient-to-r from-[#7c4dff] to-[#5d78ff] text-white rounded-lg font-medium text-lg hover:from-[#6a3dff] hover:to-[#4a6bff] transition-all"
          >
            Return to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureGuide;