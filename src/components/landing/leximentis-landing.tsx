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
      {/* Set a max-width container for better alignment consistency */}
      <div className="w-full max-w-4xl px-4 animate-fadeIn -mt-16">
        {/* Logo container with max-width constraints matching the content below */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex justify-center items-center w-full">
            <Logo 
              size="responsive" 
              linkTo={null} 
              className="mx-auto" 
            />
          </div>
        </div>
        
        {/* Content container for tagline and button */}
        <div className="text-center w-full">
          {/* Tagline with responsive text sizing */}
          <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-secondary-900 dark:text-neutral-200 font-light">
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
