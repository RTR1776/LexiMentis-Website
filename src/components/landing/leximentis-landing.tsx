import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './leximentis-landing.css';
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
      {/* Single unified container for better alignment control */}
      <div className="w-full px-4 animate-fadeIn -mt-16">
        {/* Central content container with fixed width */}
        <div className="mx-auto w-full md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-3xl flex flex-col items-center">
          {/* Logo with explicit centering */}
          <div className="mb-8 w-full flex justify-center">
            <Logo 
              size="3xl" 
              linkTo={null}
              className="mx-auto" 
              style={{ maxWidth: '100%' }}
            />
          </div>
          
          {/* Tagline with responsive text sizing */}
          <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-secondary-900 dark:text-neutral-200 font-light text-center">
            Leveraging AI to streamline workers' compensation legal workflows
          </p>
          
          {/* CTA Button with consistent centering */}
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
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LexiMentisLanding;
