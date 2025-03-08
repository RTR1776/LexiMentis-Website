import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './leximentis-landing.css';
import { TAGLINE } from '../../constants/taglines';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../layout/Logo';

const LexiMentisLanding = () => {
  const [mounted, setMounted] = useState(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col items-center justify-center">
      <div className="w-full animate-fadeIn -mt-16">
        <div className="mx-auto max-w-4xl px-4 flex flex-col items-center">
          {/* Logo container - simplified approach */}
          <div className="mb-8" style={{ width: '900px', maxWidth: '100%', margin: '0 auto', transform: 'translateX(55px)' }}>
            <img 
              src="/LexiMentis-Logo.svg" 
              alt="LexiMentis Logo" 
              className={`w-full h-auto ${darkMode ? 'leximentis-logo-dark' : ''}`}
            />
          </div>
          
          {/* Tagline with responsive text sizing */}
          <p 
            className="text-xl sm:text-2xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-secondary-900 dark:text-neutral-200 font-light text-center" 
            style={{ whiteSpace: 'nowrap' }}
          >
            {TAGLINE}
          </p>
          
          {/* CTA Button with consistent centering */}
          <Link 
            to="/how-it-works"
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 
                      text-white font-semibold py-3 px-8 sm:py-4 sm:px-16 rounded-lg transition-all duration-300 
                      shadow-lg text-base sm:text-lg hover:shadow-xl"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .leximentis-logo-dark {
          filter: brightness(0) invert(1);
        }
        .leximentis-logo-dark #rect1,
        .leximentis-logo-dark #path2 {
          filter: brightness(0) saturate(100%) invert(11%) sepia(93%) 
                 saturate(6312%) hue-rotate(0deg) brightness(99%) contrast(115%);
        }
      `}</style>
    </div>
  );
};

export default LexiMentisLanding;
