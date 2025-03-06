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
    <div className="relative w-full h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col items-center justify-center">
      <div className="text-center px-4 animate-fadeIn">
        {/* Logo image instead of text */}
        <div className="flex justify-center mb-8">
          <Logo size="xl" linkTo={null} />
        </div>
        
        {/* Tagline */}
        <p className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 
                    bg-clip-text text-transparent drop-shadow-lg mb-16">
          Bringing Order Out of Chaos
        </p>
        
        {/* Description */}
        <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
          Leveraging AI to streamline workers' compensation legal workflows
        </p>
        
        {/* CTA Button */}
        <Link 
          to="/how-it-works"
          className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 
                    text-black font-semibold py-4 px-12 rounded-lg transition-colors shadow-lg text-lg inline-block"
        >
          Learn More
        </Link>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LexiMentisLanding;
