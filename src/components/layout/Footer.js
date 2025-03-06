import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Logo from './Logo';

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} text-${darkMode ? 'white' : 'secondary-800'}`}>
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Logo size="lg" linkTo={null} />
            </div>
            <p className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'}`}>
              AI-powered workers' compensation assistant for attorneys in Kansas and Missouri.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'} hover:${darkMode ? 'text-white' : 'text-primary-600'} transition-colors`}>Home</Link></li>
              <li><Link to="/how-it-works" className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'} hover:${darkMode ? 'text-white' : 'text-primary-600'} transition-colors`}>How It Works</Link></li>
              <li><Link to="/demo" className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'} hover:${darkMode ? 'text-white' : 'text-primary-600'} transition-colors`}>Demo</Link></li>
              <li><Link to="/calculator" className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'} hover:${darkMode ? 'text-white' : 'text-primary-600'} transition-colors`}>Cost Calculator</Link></li>
              <li><Link to="/about" className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'} hover:${darkMode ? 'text-white' : 'text-primary-600'} transition-colors`}>About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/kansas-wc-resources" className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'} hover:${darkMode ? 'text-white' : 'text-primary-600'} transition-colors`}>Kansas WC Resources</Link></li>
              <li><Link to="/missouri-wc-resources" className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'} hover:${darkMode ? 'text-white' : 'text-primary-600'} transition-colors`}>Missouri WC Resources</Link></li>
              <li><Link to="/blog" className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'} hover:${darkMode ? 'text-white' : 'text-primary-600'} transition-colors`}>Legal AI Blog</Link></li>
              <li><Link to="/faq" className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'} hover:${darkMode ? 'text-white' : 'text-primary-600'} transition-colors`}>FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'}`}>Email: lj.cox@leximentis.com</li>
              <li className={`${darkMode ? 'text-secondary-300' : 'text-secondary-600'}`}>Phone: (913) 523-6061</li>
              <li><Link to="/book" className="btn btn-accent mt-4">Book a Demo</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} mt-8 pt-8 flex flex-col md:flex-row justify-between`}>
          <p className={`${darkMode ? 'text-secondary-400' : 'text-secondary-500'}`}>© {new Date().getFullYear()} LexiMentis. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className={`${darkMode ? 'text-secondary-400' : 'text-secondary-500'} hover:${darkMode ? 'text-white' : 'text-primary-600'}`}>Privacy Policy</Link>
            <Link to="/terms-of-service" className={`${darkMode ? 'text-secondary-400' : 'text-secondary-500'} hover:${darkMode ? 'text-white' : 'text-primary-600'}`}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
