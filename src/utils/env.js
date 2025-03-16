/**
 * Environment variable utility functions for LexiMentis
 * 
 * This file provides a centralized way to access environment variables
 * with proper fallbacks and validation.
 */

/**
 * Get an environment variable with validation
 * 
 * @param {string} key - The environment variable key
 * @param {string|null} defaultValue - Optional default value if not found
 * @param {boolean} isRequired - Whether the variable is required
 * @returns {string} The environment variable value
 */
export const getEnv = (key, defaultValue = null, isRequired = false) => {
  const value = process.env[key] || defaultValue;
  
  if (isRequired && !value) {
    console.error(`Required environment variable ${key} is not set.`);
    // In development, show a more visible error
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Required environment variable ${key} is not set.`);
    }
  }
  
  return value;
};

/**
 * Get API URL with proper fallback
 * 
 * @returns {string} The API URL
 */
export const getApiUrl = () => {
  return getEnv('REACT_APP_API_URL', 'http://localhost:3001');
};

/**
 * Get Google Analytics tracking ID
 * 
 * @returns {string|null} The GA tracking ID or null if not set
 */
export const getGaTrackingId = () => {
  return getEnv('REACT_APP_GA_TRACKING_ID');
};

/**
 * Get default jurisdiction (KS or MO)
 * 
 * @returns {string} The default jurisdiction code
 */
export const getDefaultJurisdiction = () => {
  return getEnv('DEFAULT_JURISDICTION', 'KS');
};

/**
 * Get Calendly booking URL
 * 
 * @returns {string} The Calendly booking URL
 */
export const getCalendlyUrl = () => {
  return getEnv('REACT_APP_CALENDLY_URL', 'https://calendly.com/lj-cox-leximentis/30min');
};

/**
 * Check if we're in development mode
 * 
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = () => {
  return getEnv('NODE_ENV') === 'development';
};

/**
 * Check if we're in production mode
 * 
 * @returns {boolean} True if in production mode
 */
export const isProduction = () => {
  return getEnv('NODE_ENV') === 'production';
}; 