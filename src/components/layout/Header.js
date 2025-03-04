import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Demo', path: '/demo' },
    { name: 'Cost Calculator', path: '/calculator' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary-600">LexiMentis</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-lg transition-colors hover:text-primary-600 ${
                  isActive ? 'text-primary-600 font-medium' : 
                  scrolled ? 'text-secondary-800' : 'text-secondary-800'
                }`
              }
              end={item.path === '/'}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="hidden md:block">
          <Link to="/book" className="btn btn-primary">
            Book a Demo
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden text-secondary-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-secondary-800'
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
              className="block w-full text-center btn btn-primary mt-4"
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
