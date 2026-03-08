import React, { useState, useRef, useEffect } from 'react';
import axios from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const TOPIC_CONTENT = {
  love: {
    intro: 'Relationships and love can bring both joy and heartache — and both are valid. Whether you\'re navigating dating, a rough patch, or the end of something, your feelings matter. You\'re not too much, and you\'re not wrong for caring. Taking time to understand what you need and feel is a strength, not a weakness. Whatever you\'re carrying, you don\'t have to carry it alone.',
    suggestions: {
      books: ['The Five Love Languages by Gary Chapman', 'Attached by Amir Levine', 'Maybe You Should Talk to Someone by Lori Gottlieb'],
      movies: ['Silver Linings Playbook', 'Eternal Sunshine of the Spotless Mind', 'Before Sunrise'],
      music: ['Soft, acoustic playlists for reflection', 'Calm piano or lo-fi when you need to breathe'],
    },
  },
  career: {
    intro: 'Work and career can weigh heavily on our minds — deadlines, decisions, and the pressure to “have it all figured out.” Remember: your worth isn’t measured by your job title or your productivity. It’s okay to feel stuck, to want a change, or to need a break. Every step you take, even the small ones, counts. You’re allowed to grow at your own pace.',
    suggestions: {
      books: ['Designing Your Life by Bill Burnett', 'Quiet by Susan Cain', 'The Almanack of Naval Ravikant'],
      movies: ['The Pursuit of Happyness', 'The Intern', 'Hidden Figures'],
      music: ['Focus or ambient playlists for work', 'Upbeat tunes when you need a boost'],
    },
  },
  family: {
    intro: 'Family can be our greatest support and sometimes our hardest challenge. Complex dynamics, expectations, and past hurts are real — and so is the love that often exists alongside them. You’re allowed to set boundaries, to feel hurt, and to still care. Healing and understanding don’t have to happen overnight. Honouring how you feel is the first step.',
    suggestions: {
      books: ['The Family Firm by Emily Oster', 'Adult Children of Emotionally Immature Parents by Lindsay C. Gibson', 'Boundaries by Henry Cloud'],
      movies: ['Little Miss Sunshine', 'Coco', 'The Farewell'],
      music: ['Nostalgic or comforting playlists', 'Gentle instrumental when you need calm'],
    },
  },
  health: {
    intro: 'Anxiety and stress can make everything feel heavier — and that’s not your fault. Your body and mind are doing their best to protect you. It’s okay to slow down, to ask for help, and to take things one moment at a time. Small acts of care — rest, breath, a walk — matter. You deserve patience, especially from yourself.',
    suggestions: {
      books: ['The Body Keeps the Score by Bessel van der Kolk', 'Unwinding Anxiety by Judson Brewer', 'Why Has Nobody Told Me This Before? by Julie Smith'],
      movies: ['Inside Out', 'A Beautiful Day in the Neighborhood', 'Soul'],
      music: ['Calm, ambient or nature sounds', 'Guided meditation or sleep playlists'],
    },
  },
  'self-esteem': {
    intro: 'How we see ourselves doesn’t always match how others see us — or how we wish we felt. You are more than your doubts and more than your worst days. Building a kinder inner voice takes time, and it’s okay if that feels hard. Every small step toward self-compassion counts. You are worthy of the same care you’d offer a friend.',
    suggestions: {
      books: ['The Gifts of Imperfection by Brené Brown', 'Self-Compassion by Kristin Neff', 'You Are a Badass by Jen Sincero'],
      movies: ['The Secret Life of Walter Mitty', 'Lady Bird', 'Eighth Grade'],
      music: ['Empowering or feel-good playlists', 'Songs that remind you of your strength'],
    },
  },
  loss: {
    intro: 'Grief doesn’t follow a schedule. Whether you’ve lost a person, a relationship, or a chapter of your life, your pain is valid. There’s no “right” way to grieve — only your way. It’s okay to have good days and hard days, to laugh and to cry. Be gentle with yourself. You don’t have to move on; you’re learning to carry it with you.',
    suggestions: {
      books: ['The Year of Magical Thinking by Joan Didion', 'It’s OK That You’re Not OK by Megan Devine', 'Tuesdays with Morrie by Mitch Albom'],
      movies: ['A Ghost Story', 'Coco', 'The Fault in Our Stars'],
      music: ['Quiet, reflective playlists', 'Songs that honour memory and feeling'],
    },
  },
  friendship: {
    intro: 'Friendship and social life can be wonderfully nourishing — and sometimes really lonely or confusing. Whether you’re missing old friends, struggling to fit in, or wondering why connection feels hard, your feelings are valid. You’re not too much or too little. Good relationships take time, and it’s okay to go at your own pace. You deserve people who get you.',
    suggestions: {
      books: ['The Friendship Formula by Caroline Millington', 'Together by Vivek H. Murthy', 'How to Win Friends and Influence People by Dale Carnegie'],
      movies: ['The Perks of Being a Wallflower', 'Lady Bird', 'Frances Ha'],
      music: ['Feel-good or nostalgic playlists with friends', 'Upbeat tunes when you need a lift'],
    },
  },
  general: {
    intro: 'Sometimes we don’t need a label — we just need to be heard. Whatever is on your mind, big or small, it matters. You’re not wasting anyone’s time. This is your space to breathe, reflect, and share at your own pace. No judgment, no rush. We’re here.',
    suggestions: {
      books: ['The Midnight Library by Matt Haig', 'Reasons to Stay Alive by Matt Haig', 'The Comfort Book by Matt Haig'],
      movies: ['The Secret Life of Walter Mitty', 'Good Will Hunting', 'Paddington 2'],
      music: ['Your favourite comfort albums or playlists', 'Whatever helps you feel grounded'],
    },
  },
};

const TOPICS = [
  { id: 'love', label: 'Love & relationships', description: 'Heart matters, dating, or breakups', emoji: '💕', accent: 'from-rose-400 to-pink-500' },
  { id: 'career', label: 'Career & work', description: 'Job stress, decisions, or direction', emoji: '💼', accent: 'from-amber-400 to-orange-500' },
  { id: 'family', label: 'Family', description: 'Family dynamics and boundaries', emoji: '👨‍👩‍👧‍👦', accent: 'from-teal-400 to-cyan-500' },
  { id: 'health', label: 'Health & anxiety', description: 'Worry, stress, or how you feel physically', emoji: '🌿', accent: 'from-emerald-400 to-green-500' },
  { id: 'self-esteem', label: 'Self-esteem', description: 'Self-worth and how you see yourself', emoji: '✨', accent: 'from-violet-400 to-purple-500' },
  { id: 'loss', label: 'Grief & loss', description: 'Loss, missing someone, or big changes', emoji: '🕊️', accent: 'from-slate-400 to-blue-400' },
  { id: 'friendship', label: 'Friendship & social', description: 'Friends, loneliness, or fitting in', emoji: '🤝', accent: 'from-indigo-400 to-purple-500' },
  { id: 'general', label: 'Just need to talk', description: 'Nothing specific — I need a listener', emoji: '🌸', accent: 'from-fuchsia-400 to-pink-400' },
];

const defaultChatPosition = () => ({
  x: typeof window !== 'undefined' ? window.innerWidth - 420 : 400,
  y: typeof window !== 'undefined' ? window.innerHeight - 560 : 120,
});

const ElariaAI = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [chatPosition, setChatPosition] = useState(defaultChatPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChatDragStart = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragOffsetRef.current = {
      dx: e.clientX - chatPosition.x,
      dy: e.clientY - chatPosition.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      setChatPosition({
        x: e.clientX - dragOffsetRef.current.dx,
        y: e.clientY - dragOffsetRef.current.dy,
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

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
      const res = await axios.post('/ai/text', { message: input, topic: selectedTopic });
      const aiMsg = { sender: 'elaria', text: res.data.reply, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const serverMsg = err.response?.data?.error;
      const fallback = 'Oh petals! Something bloomed wrong. Could you try again? 🌸';
      setMessages(prev => [...prev, {
        sender: 'elaria',
        text: typeof serverMsg === 'string' ? serverMsg : fallback,
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

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic.id);
    const topicLabel = topic.label;
    setMessages([
      {
        sender: 'elaria',
        text: `I'm glad you're here. You chose to talk about ${topicLabel} — take your time. What's on your mind?`,
        timestamp: new Date(),
      },
    ]);
  };

  const showTopicMenu = selectedTopic === null;

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
          {selectedTopic && (
            <button
              type="button"
              onClick={() => { setSelectedTopic(null); setMessages([]); }}
              className="text-sm text-purple-200 hover:text-white transition-colors"
            >
              Change topic
            </button>
          )}
          {!selectedTopic && <div className="w-6" />}
        </div>

        {/* Chat container with custom scrollbar */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <style dangerouslySetInnerHTML={{ __html: `
            .chat-container::-webkit-scrollbar { width: 8px; }
            .chat-container::-webkit-scrollbar-track { background: rgba(200, 200, 200, 0.3); border-radius: 10px; }
            .chat-container::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #68d391, #a78bfa); border-radius: 10px; }
            .chat-container::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #48bb78, #9f7aea); }
          `}} />

          {/* Topic selection menu — redesigned */}
          {showTopicMenu && (
            <div className="flex flex-col items-center justify-center min-h-[360px] text-center px-3 py-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">Hello, I'm Elaria</h2>
                <p className="text-gray-500 mt-2 max-w-md">What brings you here today? Choose what feels closest.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
                {TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className={`group relative flex flex-col items-center text-center p-5 rounded-2xl border-2 border-gray-100 bg-white shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${topic.accent} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <span className="relative w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl mb-3 group-hover:bg-white/80" aria-hidden>{topic.emoji}</span>
                    <span className="relative font-semibold text-gray-800 block">{topic.label}</span>
                    <span className="relative text-sm text-gray-500 block mt-1 leading-snug">{topic.description}</span>
                    <span className={`relative mt-2 inline-block text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r ${topic.accent}`}>Talk about this →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topic intro card only (when a topic is selected) — chat is in pop-out below */}
          {!showTopicMenu && selectedTopic && TOPIC_CONTENT[selectedTopic] && (() => {
            const topicMeta = TOPICS.find((t) => t.id === selectedTopic);
            const content = TOPIC_CONTENT[selectedTopic];
            return (
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/95 to-white p-6 shadow-lg max-w-2xl mx-auto">
              {/* Topic title */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl" aria-hidden>{topicMeta?.emoji}</span>
                <h3 className="text-lg font-semibold text-purple-800">{topicMeta?.label}</h3>
              </div>
              {/* Detailed intro */}
              <p className="text-gray-700 leading-relaxed text-[15px] mb-5">
                {content.intro}
              </p>
              <p className="text-sm text-purple-600 font-medium mb-4">A little comfort for you — books, films, and music that might help. You can add any of these to your Comfort Space below.</p>

              {/* Books + link to Reading Room */}
              {content.suggestions.books?.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-white/80 border border-purple-100">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">Suggested books</span>
                    <button
                      type="button"
                      onClick={() => navigate('/quiet-library')}
                      className="text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      Open Reading Room →
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">Add these to your collection in the Reading Room.</p>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600">
                    {content.suggestions.books.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Movies / series + link to Screen Room */}
              {content.suggestions.movies?.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-white/80 border border-purple-100">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">Movies & series</span>
                    <button
                      type="button"
                      onClick={() => navigate('/comfort-screen')}
                      className="text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      Open Screen Room →
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">Save these in your Screen Room to watch when you need comfort.</p>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600">
                    {content.suggestions.movies.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Music + link to Music Room */}
              {content.suggestions.music?.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-white/80 border border-purple-100">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800">Music & playlists</span>
                    <button
                      type="button"
                      onClick={() => navigate('/sound-corner')}
                      className="text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      Open Music Room →
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">Add tracks or playlists to your Music Room.</p>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-gray-600">
                    {content.suggestions.music.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-purple-600 italic mt-2">
                Use the links above to open each room and add items to your Comfort Space whenever you like.
              </p>
              <p className="text-sm text-gray-500 mt-4">Open the chat window to talk with Elaria →</p>
            </div>
            );
          })()}
        </div>

        {/* Draggable chat pop-out (when topic selected) */}
        {!showTopicMenu && (
        <div
          className="fixed z-50 flex flex-col w-[380px] h-[520px] rounded-2xl shadow-2xl border-2 border-purple-200 bg-white overflow-hidden select-none"
          style={{
            left: typeof window !== 'undefined' ? Math.min(Math.max(0, chatPosition.x), window.innerWidth - 384) : chatPosition.x,
            top: typeof window !== 'undefined' ? Math.min(Math.max(0, chatPosition.y), window.innerHeight - 524) : chatPosition.y,
            cursor: isDragging ? 'grabbing' : 'default',
          }}
        >
          {/* Draggable header */}
          <div
            role="button"
            tabIndex={0}
            onMouseDown={handleChatDragStart}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleChatDragStart(e); }}
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-800 cursor-grab active:cursor-grabbing border-b border-purple-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-white/80">⋮⋮</span>
              <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="font-semibold text-white">Elaria</span>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedTopic(null); setMessages([]); }}
              className="text-white/80 hover:text-white text-sm"
            >
              Change topic
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 chat-container" style={{ minHeight: 0 }}>
            <div className="space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${msg.sender === 'user' ? 'bg-green-100 border border-green-200 rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-green-600' : 'text-gray-400'}`}>{formatTime(msg.timestamp)}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl rounded-bl-none px-3 py-2 bg-white border border-gray-200 flex items-center gap-2 text-sm text-purple-600">
                    <span className="flex gap-1"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} /><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} /></span>
                    Elaria is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="relative flex items-center">
              <textarea
                rows="1"
                className="flex-1 border border-gray-300 rounded-full pl-4 pr-11 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none bg-gray-50"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleEnter}
              />
              <button
                type="button"
                className={`absolute right-1.5 w-8 h-8 rounded-full flex items-center justify-center ${input.trim() ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ElariaAI;