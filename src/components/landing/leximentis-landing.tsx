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
      <div className="text-center px-4 animate-fadeIn max-w-4xl mx-auto -mt-16"> {/* Added -mt-16 to move everything up */}
        {/* Logo centered with proper spacing */}
        <div className="flex justify-center items-center mb-6"> {/* Reduced margin-bottom from mb-8 to mb-6 */}
          <Logo size="3xl" linkTo={null} />
        </div>
        
        {/* Tagline with updated styling */}
        <p className="text-2xl mb-8 mx-auto text-secondary-900 dark:text-neutral-200 font-light max-w-2xl"> {/* Added max-width and reduced margin-bottom */}
          Leveraging AI to streamline workers' compensation legal workflows
        </p>
        
        {/* CTA Button with updated styling */}
        <div className="flex justify-center"> {/* Added container div for proper centering */}
          <Link 
            to="/how-it-works"
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 
                      text-white font-semibold py-4 px-16 rounded-lg transition-all duration-300 
                      shadow-lg text-lg inline-block hover:shadow-xl"
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
      `}</style>
    </div>
  );
};

export default LexiMentisLanding;
