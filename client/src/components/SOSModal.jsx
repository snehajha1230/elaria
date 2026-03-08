import React from 'react';

const SOSModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-2 border-red-200 dark:border-red-900 animate-pulse">
        <div className="flex flex-col items-center">
          {/* Animated alert icon */}
          <div className="mb-5 animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 text-red-600 dark:text-red-500 font-sans">
            Emergency Assistance Request
          </h2>
          
          <p className="mb-6 text-gray-700 dark:text-gray-300 text-center leading-relaxed">
            You're about to send an <span className="font-semibold text-red-600 dark:text-red-400">emergency alert</span> to your contacts and the Elaria community. 
            This should only be used in genuine emergencies.
          </p>
          
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex-1 max-w-[150px]"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-300/30 dark:hover:shadow-red-700/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex-1 max-w-[150px]"
            >
              <span className="font-bold">SEND SOS</span>
            </button>
          </div>
          
          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            Your safety is our priority. Help will be on the way.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;