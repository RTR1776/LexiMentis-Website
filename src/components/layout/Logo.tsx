import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'responsive';
  linkTo: string | null;
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  linkTo = '/', 
  className = '',
  style = {}
}) => {
  const { darkMode } = useTheme();
  
  const sizeClasses = {
    sm: 'w-32',      // 8rem (128px)
    md: 'w-40',      // 10rem (160px)
    lg: 'w-48',      // 12rem (192px)
    xl: 'w-64',      // 16rem (256px)
    '2xl': 'w-80',   // 20rem (320px)
    '3xl': 'w-96',   // 24rem (384px)
    '4xl': 'w-[28rem]', // 28rem (448px)
    '5xl': 'w-[32rem]', // 32rem (512px)
    'responsive': 'w-[50%] sm:w-[60%] md:w-[70%] lg:w-[80%] xl:w-[60%] 2xl:w-[50%]',
  };
  
  const logoClass = `${size === 'responsive' ? sizeClasses.responsive : sizeClasses[size]} h-auto ${className} ${darkMode ? 'leximentis-logo-dark' : ''}`;
  
  const logo = (
    <>
      <img 
        src="/LexiMentis-Logo.svg" 
        alt="LexiMentis Logo" 
        className={logoClass}
        style={{ maxWidth: '100%', height: 'auto', ...style }}
      />
      {darkMode && (
        <style jsx="true">{`
          .leximentis-logo-dark {
            filter: brightness(0) invert(1);
          }
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