import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  linkTo?: string | null;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  linkTo = '/', 
  className = '' 
}) => {
  const { darkMode } = useTheme();
  
  const sizes = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-32 w-auto',  // Increased from h-24
    '2xl': 'h-48 w-auto',
    '3xl': 'h-64 w-auto',
  };
  
  const logoImg = (
    <>
      <img 
        src="/LexiMentis-Logo.svg" 
        alt="LexiMentis" 
        className={`${sizes[size]} ${className} ${darkMode ? 'leximentis-logo-dark' : ''}`}
      />
      {/* CSS to preserve red elements in dark mode */}
      {darkMode && (
        <style jsx="true">{`
          .leximentis-logo-dark {
            filter: brightness(0) invert(1);
          }
          /* Target the specific SVG elements by their IDs and preserve the red color */
          .leximentis-logo-dark #rect1,
          .leximentis-logo-dark #circle1 {
            filter: brightness(0) saturate(100%) invert(11%) sepia(93%) 
                   saturate(6312%) hue-rotate(0deg) brightness(99%) contrast(115%);
          }
        `}</style>
      )}
    </>
  );
  
  if (linkTo === null) {
    return logoImg;
  }
  
  return (
    <Link to={linkTo} className="flex items-center">
      {logoImg}
    </Link>
  );
};

export default Logo;