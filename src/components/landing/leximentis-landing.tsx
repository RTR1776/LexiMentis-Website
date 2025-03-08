import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './leximentis-landing.css';
import { TAGLINE } from '../../constants/taglines';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../layout/Logo';
// Make sure the path is correct - this is likely the issue
import Tagline from '../common/Tagline';

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
          {/* Logo container */}
          <div className="mb-8" style={{ width: '900px', maxWidth: '100%', margin: '0 auto', transform: 'translateX(55px)' }}>
            <img 
              src="/LexiMentis-Logo.svg" 
              alt="LexiMentis Logo" 
              className={`w-full h-auto ${darkMode ? 'leximentis-logo-dark' : ''}`}
            />
          </div>
          
          {/* Use a simple fallback if Tagline fails to load */}
          <div style={{ transform: 'translateX(55px)' }}>
            {typeof Tagline === 'function' ? (
              <div className="w-full overflow-hidden mb-6 sm:mb-8">
                <Tagline variant="default" />
              </div>
            ) : (
              <p className="text-xl sm:text-2xl font-light text-center mb-6 sm:mb-8">
                {TAGLINE}
              </p>
            )}
            
            {/* CTA Button */}
            <div className="flex justify-center">
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
        </div>
      </div>
      
      <style jsx="true">{`
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
