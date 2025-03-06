import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  linkTo: string | null;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  linkTo = '/', 
  className = '' 
}) => {
  const { darkMode } = useTheme();
  
  const sizeClasses = {
    sm: 'w-32',     // Increased from w-24
    md: 'w-40',     // Increased from w-32
    lg: 'w-48',     // Increased from w-40
    xl: 'w-56',     // Increased from w-48
    '2xl': 'w-64',  // Increased from w-56
    '3xl': 'w-72',  // Increased from w-64
    '4xl': 'w-96',  // New larger size (24rem = 384px)
  };
  
  const logoClass = `${sizeClasses[size]} h-auto ${className} ${darkMode ? 'leximentis-logo-dark' : ''}`;
  
  const logo = (
    <>
      <img 
        src="/LexiMentis-Logo.svg" 
        alt="LexiMentis Logo" 
        className={logoClass}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {/* CSS to preserve red elements in dark mode */}
      {darkMode && (
        <style jsx="true">{`
          .leximentis-logo-dark {
            filter: brightness(0) invert(1);
          }
          /* Target the specific SVG elements by their IDs and preserve the red color */
          .leximentis-logo-dark #rect1,
          .leximentis-logo-dark #path2 {
            filter: brightness(0) saturate(100%) invert(11%) sepia(93%) 
                   saturate(6312%) hue-rotate(0deg) brightness(99%) contrast(115%);
          }
        `}</style>
      )}
    </>
  );
  
  return linkTo ? <Link to={linkTo}>{logo}</Link> : logo;
};

export default Logo;