import React from 'react';
import { TAGLINE, SHORT_TAGLINE } from '../../constants/taglines';
import { useTheme } from '../../context/ThemeContext';

const Tagline = ({ 
  variant = 'default', 
  className = '', 
  useShort = false,
  centered = true 
}) => {
  const { darkMode } = useTheme();
  const taglineText = useShort ? SHORT_TAGLINE : TAGLINE;
  
  // Base styling classes
  const baseClasses = "font-light";
  const textColorClass = darkMode ? "text-neutral-200" : "text-secondary-900";
  const alignmentClass = centered ? "text-center" : "text-left";
  
  // Size variant classes
  const sizeClasses = {
    small: "text-lg",
    default: "text-xl sm:text-2xl",
    large: "text-2xl sm:text-3xl md:text-4xl",
  };
  
  return (
    <div className="w-full overflow-hidden">
      <p className={`${baseClasses} ${textColorClass} ${alignmentClass} ${sizeClasses[variant] || sizeClasses.default} ${className}`}>
        {taglineText}
      </p>
    </div>
  );
};

export default Tagline;
