import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './leximentis-landing.css';

const LexiMentisLanding = () => {
  // Simple state to track if component is mounted (for potential animations later)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Clean up function
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col items-center justify-center">
      {/* Main content container with proper spacing */}
      <div className="text-center px-4 animate-fadeIn">
        {/* Main logo text */}
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 
                      bg-clip-text text-transparent drop-shadow-xl tracking-wide mb-8">
          LEXIMENTIS
        </h1>
        
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
      
      {/* Add simple fade-in animations with CSS */}
      <style jsx>{`
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
