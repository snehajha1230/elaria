import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Trigger prompt on button click
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  const handleGetStarted = () => navigate('/signup');
  const handleExplore = () => navigate('/about');
  const handleHome = () => navigate('/home');

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Image */}
      <img
        src="https://davidsuzuki.org/wp-content/uploads/2023/09/healing-forest-2800x1680-1-scaled.jpg"
        alt="Comforting mountain"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-light text-black leading-snug">
            <span className="font-semibold">Don't Let The Hard Days Win</span>
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-black font-normal">
            Welcome to <span className="font-semibold">ELARIA</span> — your personal safe space, We hear you ♥
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <button
              onClick={handleExplore}
              className="bg-white text-black border border-black hover:bg-black hover:text-white px-6 py-3 text-sm uppercase tracking-wide font-medium transition-all duration-300 shadow hover:scale-105"
            >
              About
            </button>
            <button
              onClick={handleGetStarted}
              className="bg-black text-white border border-black hover:bg-white hover:text-black px-6 py-3 text-sm uppercase tracking-wide font-medium transition-all duration-300 shadow hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={handleHome}
              className="bg-white text-black border border-black hover:bg-black hover:text-white px-6 py-3 text-sm uppercase tracking-wide font-medium transition-all duration-300 shadow hover:scale-105"
            >
              Home
            </button>

            {/*Install App Button */}
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="bg-green-600 text-white border border-black hover:bg-white hover:text-black px-6 py-3 text-sm uppercase tracking-wide font-medium transition-all duration-300 shadow hover:scale-105"
              >
                Install App
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
