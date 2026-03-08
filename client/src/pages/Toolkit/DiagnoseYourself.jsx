import React, { useState, useEffect } from 'react';
import axios from '../../utils/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const assessmentTypes = {
  depression: {
    title: "Depression Assessment",
    description: "PHQ-9 is a validated diagnostic tool for depression severity. Answer honestly for accurate results.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    questions: [
      "Little interest or pleasure in doing things?",
      "Feeling down, depressed, or hopeless?",
      "Trouble falling or staying asleep, or sleeping too much?",
      "Feeling tired or having little energy?",
      "Poor appetite or overeating?",
      "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
      "Trouble concentrating on things, such as reading the newspaper or watching television?",
      "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
      "Thoughts that you would be better off dead, or of hurting yourself in some way?"
    ],
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day"
    ],
    scoring: {
      minimal: { max: 4, color: 'green', label: 'Minimal depression' },
      mild: { max: 9, color: 'yellow', label: 'Mild depression' },
      moderate: { max: 14, color: 'orange', label: 'Moderate depression' },
      severe: { max: 19, color: 'red', label: 'Moderately severe depression' },
      verySevere: { max: 27, color: 'red', label: 'Severe depression' }
    },
    maxScore: 27,
    getSuggestion: (score) => {
      if (score <= 4) return "Your responses suggest you're experiencing minimal symptoms of depression. Continue practicing self-care and monitor your mood.";
      if (score <= 9) return "Your responses indicate mild depressive symptoms. Consider stress management techniques and monitor your symptoms. If they persist, consult a professional.";
      if (score <= 14) return "Your responses suggest moderate depression. This may be impacting your daily life. Consider reaching out to a mental health professional for support.";
      if (score <= 19) return "Your responses indicate moderately severe depression. Professional help is recommended. Please consider contacting a therapist or counselor soon.";
      return "Your responses suggest severe depression. It's important to seek professional help immediately. You're not alone - help is available and effective.";
    }
  },
  anxiety: {
    title: "Anxiety Assessment",
    description: "GAD-7 is a validated tool for assessing anxiety severity. Answer based on your experiences over the last 2 weeks.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    questions: [
      "Feeling nervous, anxious or on edge?",
      "Not being able to stop or control worrying?",
      "Worrying too much about different things?",
      "Trouble relaxing?",
      "Being so restless that it is hard to sit still?",
      "Becoming easily annoyed or irritable?",
      "Feeling afraid as if something awful might happen?"
    ],
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day"
    ],
    scoring: {
      minimal: { max: 4, color: 'green', label: 'Minimal anxiety' },
      mild: { max: 9, color: 'yellow', label: 'Mild anxiety' },
      moderate: { max: 14, color: 'orange', label: 'Moderate anxiety' },
      severe: { max: 21, color: 'red', label: 'Severe anxiety' }
    },
    maxScore: 21,
    getSuggestion: (score) => {
      if (score <= 4) return "Your responses suggest minimal anxiety. Continue practicing stress management techniques.";
      if (score <= 9) return "Your responses indicate mild anxiety. Consider mindfulness exercises and monitor your symptoms.";
      if (score <= 14) return "Your responses suggest moderate anxiety that may benefit from professional support or therapy.";
      return "Your responses indicate severe anxiety. Professional help is recommended to develop coping strategies.";
    }
  },
  // stress: {
  //   title: "Stress Assessment",
  //   description: "PSS is a validated tool for measuring perceived stress levels. Answer based on your feelings in the last month.",
  //   icon: (
  //     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  //     </svg>
  //   ),
  //   questions: [
  //     "In the last month, how often have you been upset because of something that happened unexpectedly?",
  //     "In the last month, how often have you felt that you were unable to control the important things in your life?",
  //     "In the last month, how often have you felt nervous and 'stressed'?",
  //     "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  //     "In the last month, how often have you felt that things were going your way?",
  //     "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  //     "In the last month, how often have you been able to control irritations in your life?",
  //     "In the last month, how often have you felt that you were on top of things?",
  //     "In the last month, how often have you been angered because of things that were outside of your control?",
  //     "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
  //   ],
  //   options: [
  //     "Never",
  //     "Almost never",
  //     "Sometimes",
  //     "Fairly often",
  //     "Very often"
  //   ],
  //   scoring: {
  //     low: { max: 13, color: 'green', label: 'Low stress' },
  //     moderate: { max: 26, color: 'yellow', label: 'Moderate stress' },
  //     high: { max: 40, color: 'red', label: 'High stress' }
  //   },
  //   maxScore: 40,
  //   getSuggestion: (score) => {
  //     if (score <= 13) return "Your responses suggest low stress levels. Maintain your healthy coping strategies.";
  //     if (score <= 26) return "Your responses indicate moderate stress. Consider stress reduction techniques like exercise or meditation.";
  //     return "Your responses suggest high stress levels that may benefit from professional support or lifestyle changes.";
  //   }
  // },
  panic: {
    title: "Panic Assessment",
    description: "PDSS-SR is a validated tool for assessing panic disorder symptoms. Answer based on your experiences.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    questions: [
      "Have you had sudden attacks of fear or panic where you felt extremely scared or uncomfortable?",
      "During these attacks, did you experience shortness of breath or a feeling of being smothered?",
      "During these attacks, did you experience chest pain or discomfort?",
      "During these attacks, did you experience trembling or shaking?",
      "During these attacks, did you experience sweating?",
      "During these attacks, did you experience a feeling of choking?",
      "During these attacks, did you experience nausea or abdominal distress?",
      "During these attacks, did you experience dizziness, unsteadiness, lightheadedness, or faintness?",
      "During these attacks, did you experience feelings of unreality or being detached from yourself?",
      "During these attacks, did you experience fear of losing control or going crazy?",
      "During these attacks, did you experience fear of dying?",
      "During these attacks, did you experience numbness or tingling sensations?",
      "During these attacks, did you experience chills or hot flashes?"
    ],
    options: [
      "Not at all",
      "Mild",
      "Moderate",
      "Severe"
    ],
    scoring: {
      minimal: { max: 8, color: 'green', label: 'Minimal symptoms' },
      mild: { max: 15, color: 'yellow', label: 'Mild panic symptoms' },
      moderate: { max: 24, color: 'orange', label: 'Moderate panic symptoms' },
      severe: { max: 39, color: 'red', label: 'Severe panic symptoms' }
    },
    maxScore: 39,
    getSuggestion: (score) => {
      if (score <= 8) return "Your responses suggest minimal panic symptoms. Continue monitoring your symptoms.";
      if (score <= 15) return "Your responses indicate mild panic symptoms. Consider relaxation techniques and monitor frequency.";
      if (score <= 24) return "Your responses suggest moderate panic symptoms that may benefit from professional evaluation.";
      return "Your responses indicate severe panic symptoms. Professional help is recommended to develop coping strategies.";
    }
  }
};

const DiagnoseYourself = () => {
  const [activeTab, setActiveTab] = useState('depression');
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Initialize answers for all assessments
  useEffect(() => {
    const initialAnswers = {};
    Object.keys(assessmentTypes).forEach(type => {
      initialAnswers[type] = Array(assessmentTypes[type].questions.length).fill(null);
    });
    setAnswers(initialAnswers);
  }, []);

  const currentAssessment = assessmentTypes[activeTab];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleChange = (qIndex, value) => {
    const updated = { ...answers };
    updated[activeTab][qIndex] = parseInt(value);
    setAnswers(updated);
    
    // Calculate progress
    const answeredCount = updated[activeTab].filter(a => a !== null).length;
    const totalQuestions = currentAssessment.questions.length;
    setProgress(Math.round((answeredCount / totalQuestions) * 100));
  };

  const handleSubmit = async () => {
    if (answers[activeTab].includes(null)) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, you would send this to your backend
      // const res = await axios.post('/diagnose', { 
      //   type: activeTab,
      //   answers: answers[activeTab] 
      // });
      
      // Simulate API response
      const score = answers[activeTab].reduce((a, b) => a + b, 0);
      const result = {
        score,
        suggestion: currentAssessment.getSuggestion(score),
        severity: getSeverityText(score, activeTab),
        color: getSeverityColor(score, activeTab)
      };
      
      setResults(prev => ({
        ...prev,
        [activeTab]: result
      }));
      
      // Scroll to result
      setTimeout(() => {
        document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (score, type) => {
    const assessment = assessmentTypes[type];
    if (score <= assessment.scoring.minimal.max) return 'green';
    if (score <= assessment.scoring.mild.max) return 'yellow';
    if (assessment.scoring.moderate && score <= assessment.scoring.moderate.max) return 'orange';
    return 'red';
  };

  const getSeverityText = (score, type) => {
    const assessment = assessmentTypes[type];
    if (score <= assessment.scoring.minimal.max) return assessment.scoring.minimal.label;
    if (score <= assessment.scoring.mild.max) return assessment.scoring.mild.label;
    if (assessment.scoring.moderate && score <= assessment.scoring.moderate.max) return assessment.scoring.moderate.label;
    if (assessment.scoring.severe && score <= assessment.scoring.severe.max) return assessment.scoring.severe.label;
    return assessment.scoring.verySevere?.label || 'Very severe symptoms';
  };

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
      orange: 'bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200',
      red: 'bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200',
      purple: 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200',
      blue: 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getProgressColor = () => {
    if (progress < 30) return 'red';
    if (progress < 70) return 'yellow';
    return 'green';
  };

  return (
    
    <div className="min-h-screen py-8 px-4 sm:px-6 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
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
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">Mental Health Self-Assessment</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select an assessment below to evaluate different aspects of your mental health. All assessments are confidential.
          </p>
        </div>

        {/* Assessment Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(assessmentTypes).map(([key, assessment]) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center ${
                  activeTab === key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                }`}
              >
                <span className="mr-2">
                  {React.cloneElement(assessment.icon, { className: `h-5 w-5 ${activeTab === key ? 'text-white' : `text-${key === 'anxiety' ? 'purple' : key === 'stress' ? 'orange' : key === 'panic' ? 'red' : 'blue'}-600 dark:text-${key === 'anxiety' ? 'purple' : key === 'stress' ? 'orange' : key === 'panic' ? 'red' : 'blue'}-400`}` })}
                </span>
                {assessment.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Current Assessment Info */}
        <div className="bg-white dark:bg-gray-700/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                {currentAssessment.icon}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{currentAssessment.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{currentAssessment.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress: {progress}%</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {answers[activeTab]?.filter(a => a !== null).length || 0}/{currentAssessment.questions.length} answered
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      getProgressColor() === 'green' ? 'bg-green-500' : 
                      getProgressColor() === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questionnaire */}
        <div className="space-y-6 mb-10">
          {currentAssessment.questions.map((q, i) => (
            <div key={i} className="bg-white dark:bg-gray-700/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <p className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                  {i + 1}
                </span>
                {q}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentAssessment.options.map((opt, j) => (
                  <label 
                    key={j} 
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      answers[activeTab]?.[i] === j 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={j}
                      onChange={() => handleChange(i, j)}
                      checked={answers[activeTab]?.[i] === j}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-200">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center mb-16">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-full text-lg font-medium shadow-lg transition-all ${
              isSubmitting 
                ? 'bg-blue-400 dark:bg-blue-700 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
            } text-white flex items-center justify-center mx-auto min-w-[200px]`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get Your Results
              </>
            )}
          </button>
        </div>
        

        {/* Results Section */}
        {results[activeTab] && (
          <div id="result-section" className={`mt-8 p-6 rounded-xl border ${getColorClasses(results[activeTab].color)} shadow-lg mb-16`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                  Assessment Results: <span className="capitalize">{results[activeTab].severity}</span>
                </h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your score: {results[activeTab].score}/{currentAssessment.maxScore}</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {Math.round((results[activeTab].score / currentAssessment.maxScore) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        results[activeTab].color === 'green' ? 'bg-green-500' : 
                        results[activeTab].color === 'yellow' ? 'bg-yellow-500' : 
                        results[activeTab].color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${(results[activeTab].score / currentAssessment.maxScore) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{results[activeTab].suggestion}</p>
                  
                  {/* <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Interpretation Guide:</h3>
                    <ul className="space-y-1">
                      {Object.entries(currentAssessment.scoring).map(([key, value]) => (
                        <li key={key} className="flex items-start">
                          <span className={`text-${value.color}-500 mr-2`}>•</span> 
                          0-{value.max}: {value.label}
                        </li>
                      ))}
                    </ul>
                  </div> */}
                  
                  <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Next Steps:</h3>
                    <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                      <li>• Consider tracking your symptoms daily to monitor changes</li>
                      <li>• Practice self-care techniques like mindfulness or exercise</li>
                      <li>• Reach out to trusted friends or family about how you're feeling</li>
                      {results[activeTab].color === 'red' || results[activeTab].color === 'orange' ? (
                        <li className="font-semibold">• Consider contacting a mental health professional for support</li>
                      ) : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources Section */}
        {/* <div className="bg-white dark:bg-gray-700/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Mental Health Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Crisis Support</h3>
              <p className="text-blue-700 dark:text-blue-300 mb-2">If you're in crisis or having thoughts of self-harm, please reach out immediately:</p>
              <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                <li>• National Suicide Prevention Lifeline: 988</li>
                <li>• Crisis Text Line: Text HOME to 741741</li>
                <li>• Your local emergency services</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Therapy Options</h3>
              <p className="text-purple-700 dark:text-purple-300 mb-2">Consider these options for professional support:</p>
              <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                <li>• Psychology Today Therapist Finder</li>
                <li>• BetterHelp (online therapy)</li>
                <li>• TalkSpace (online therapy)</li>
                <li>• Your primary care physician</li>
              </ul>
            </div>
          </div>
        </div> */}
        
      </div>
    </div>
  );
};

export default DiagnoseYourself;