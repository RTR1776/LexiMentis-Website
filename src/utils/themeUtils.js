/**
 * Theme utility functions for consistent styling across components
 */

/**
 * Returns button classes based on button type and current theme
 * @param {string} type - 'primary', 'secondary', or 'accent'
 * @param {boolean} darkMode - Whether dark mode is active
 * @param {string} additionalClasses - Additional classes to append
 * @returns {string} CSS classes for the button
 */
export const getButtonClasses = (type, darkMode, additionalClasses = '') => {
  const baseClasses = 'px-6 py-3 font-medium rounded-md transition-all duration-300 ';
  
  if (type === 'primary') {
    return `${baseClasses} bg-primary-500 text-white hover:bg-primary-600 ${additionalClasses}`;
  }
  
  if (type === 'secondary') {
    return darkMode
      ? `${baseClasses} bg-transparent text-white border-2 border-primary-500 hover:bg-primary-900/30 ${additionalClasses}`
      : `${baseClasses} bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-50 ${additionalClasses}`;
  }
  
  if (type === 'accent') {
    return `${baseClasses} bg-accent-800 text-white hover:bg-accent-700 ${additionalClasses}`;
  }
  
  return baseClasses + additionalClasses;
};

/**
 * Returns text color classes based on importance and theme
 * @param {string} importance - 'primary', 'secondary', or 'muted'
 * @param {boolean} darkMode - Whether dark mode is active
 * @returns {string} CSS classes for text color
 */
export const getTextColorClasses = (importance, darkMode) => {
  if (importance === 'primary') {
    return darkMode ? 'text-neutral-50' : 'text-secondary-900';
  }
  
  if (importance === 'secondary') {
    return darkMode ? 'text-neutral-300' : 'text-secondary-700';
  }
  
  if (importance === 'muted') {
    return darkMode ? 'text-neutral-400' : 'text-secondary-500';
  }
  
  if (importance === 'accent') {
    return darkMode ? 'text-primary-400' : 'text-primary-500';
  }
  
  return darkMode ? 'text-neutral-50' : 'text-secondary-900';
};