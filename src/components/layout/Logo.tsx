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
    <img 
      src="/LexiMentis-Logo.svg" 
      alt="LexiMentis" 
      className={`${sizes[size]} ${darkMode ? 'filter brightness-0 invert' : ''} ${className}`}
    />
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