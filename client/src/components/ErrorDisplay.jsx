// src/components/ErrorDisplay.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorDisplay = ({ message, onRetry, onHome }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-6 max-w-md">
        <div className="text-red-500 text-lg mb-4">{message || 'An error occurred'}</div>
        <div className="flex justify-center space-x-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          )}
          <button
            onClick={onHome || (() => navigate('/'))}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;