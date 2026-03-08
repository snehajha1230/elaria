import React, { useState, useRef, useEffect } from 'react';
import axios from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const ElariaAI = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create falling flower petals
  useEffect(() => {
    const createPetal = () => {
      const petal = document.createElement('div');
      petal.innerHTML = '🌸';
      petal.style.position = 'fixed';
      petal.style.top = '0px';
      petal.style.left = `${Math.random() * window.innerWidth}px`;
      petal.style.fontSize = `${Math.random() * 20 + 10}px`;
      petal.style.opacity = Math.random() * 0.5 + 0.3;
      petal.style.animation = `fall ${Math.random() * 8 + 8}s linear infinite`;
      petal.style.zIndex = '0';
      petal.style.pointerEvents = 'none';
      document.body.appendChild(petal);
      
      // Remove petal after animation completes
      setTimeout(() => {
        petal.remove();
      }, 16000);
    };

    // Add CSS animation for falling
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fall {
        to {
          transform: translateY(${window.innerHeight}px) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);

    // Create petals periodically
    const interval = setInterval(createPetal, 800);

    return () => {
      clearInterval(interval);
      document.head.removeChild(style);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/ai/text', { message: input });
      const aiMsg = { sender: 'elaria', text: res.data.reply, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: 'elaria', 
        text: 'Oh petals! Something bloomed wrong. Could you ask again? 🌸',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-purple-100 relative overflow-hidden">
      {/* Falling flower petals container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

      {/* Main chat container */}
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border-2 border-gray-200" style={{ height: '85vh' }}>
        {/* Header with home button */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-3 flex items-center justify-between border-b border-gray-300">
          <button 
            onClick={() => navigate('/home')}
            className="text-white hover:text-purple-200 transition-colors"
            aria-label="Go to home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-2 border border-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white drop-shadow-md">Elaria AI</h1>
          </div>
          <div className="w-6"></div>
        </div>

        {/* Chat container with custom scrollbar */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {/* Custom scrollbar styles */}
          <style jsx>{`
            .chat-container::-webkit-scrollbar {
              width: 8px;
            }
            .chat-container::-webkit-scrollbar-track {
              background: rgba(200, 200, 200, 0.3);
              border-radius: 10px;
            }
            .chat-container::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #68d391, #a78bfa);
              border-radius: 10px;
            }
            .chat-container::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #48bb78, #9f7aea);
            }
          `}</style>

          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
              {/* <div className="w-24 h-24 mb-4 rounded-full bg-purple-100 flex items-center justify-center border border-purple-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div> */}
              <h2 className="text-xl font-semibold text-purple-600 mb-2">Hello! I'm Elaria</h2>
              <p className="max-w-md text-gray-500">How are you feeling right now?</p>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-3 chat-container" style={{ maxHeight: '100%', overflowY: 'auto' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 relative
                    ${msg.sender === 'user' 
                      ? 'bg-green-100 text-black rounded-br-none shadow-md border border-green-200' 
                      : 'bg-white text-black rounded-bl-none shadow-sm border border-gray-200'}`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-green-600' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                  
                  {/* Chat bubble tip */}
                  <div className={`absolute w-3 h-3 -bottom-1 
                    ${msg.sender === 'user' 
                      ? 'right-0 bg-green-100 border-r border-b border-green-200 rounded-bl-full' 
                      : 'left-0 bg-white border-l border-b border-gray-200 rounded-br-full'}`}
                  />
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-sm text-purple-600 ml-2">Elaria is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 p-3">
          <div className="relative flex items-center">
            <textarea
              rows="1"
              className="flex-1 border border-gray-300 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent resize-none bg-gray-50 text-black placeholder-gray-400"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
            />
            <button
              className={`absolute right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all
                ${input.trim() 
                  ? 'bg-gradient-to-r from-green-400 to-purple-400 text-white hover:shadow-lg' 
                  : 'bg-gray-200 text-gray-500'}`}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElariaAI;