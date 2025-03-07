import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import Logo from './Logo';

const Header = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Demo', path: '/demo' },
    { name: 'Cost Calculator', path: '/calculator' },
    { name: 'About', path: '/about' },
    { name: 'Case Management', path: '/case-management' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? darkMode 
            ? 'bg-secondary-800 shadow-md shadow-secondary-900/20 py-2' 
            : 'bg-white shadow-md py-2'
          : darkMode 
            ? 'bg-transparent py-4' 
            : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Logo size="md" />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-lg font-semibold transition-colors hover:text-primary-600 ${
                  isActive 
                    ? 'text-primary-600 font-bold' 
                    : darkMode 
                      ? scrolled ? 'text-white' : 'text-white font-bold' 
                      : scrolled ? 'text-secondary-900 font-bold' : 'text-secondary-900 font-bold'
                }`
              }
              end={item.path === '/'}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'bg-secondary-700 hover:bg-secondary-600 text-white' 
                : 'bg-neutral-100 hover:bg-neutral-200 text-secondary-900'
            }`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link to="/book" className={`btn ${darkMode ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'btn-primary'}`}>
            Book a Demo
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 rounded-full transition-colors ${
              darkMode 
                ? 'bg-secondary-700 hover:bg-secondary-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-secondary-800'
            }`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            className={darkMode ? "text-white" : "text-secondary-800"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-secondary-800' : 'bg-white'} shadow-lg absolute w-full`}>
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md font-semibold ${
                    isActive 
                      ? darkMode 
                        ? 'bg-secondary-700 text-white font-bold' 
                        : 'bg-primary-50 text-primary-600 font-bold' 
                      : darkMode 
                        ? 'text-white hover:bg-secondary-700' 
                        : 'text-secondary-900 hover:bg-gray-100'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
                end={item.path === '/'}
              >
                {item.name}
              </NavLink>
            ))}
            <Link
              to="/book"
              className={`block w-full text-center mt-4 ${
                darkMode 
                  ? 'bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg'
                  : 'btn btn-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Book a Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
