import React from 'react';
import { useTheme } from '../context/ThemeContext';
// ...existing code...

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  // ...existing code...
  
  return (
    <header className={darkMode ? 'header dark' : 'header'}>
      {/* ...existing code... */}
      <button onClick={toggleDarkMode}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {/* ...existing code... */}
    </header>
  );
};

export default Header;
