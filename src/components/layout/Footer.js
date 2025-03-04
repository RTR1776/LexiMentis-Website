import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary-800 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LexiMentis</h3>
            <p className="text-secondary-300">
              AI-powered workers' compensation assistant for attorneys in Kansas and Missouri.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-secondary-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/how-it-works" className="text-secondary-300 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/demo" className="text-secondary-300 hover:text-white transition-colors">Demo</Link></li>
              <li><Link to="/calculator" className="text-secondary-300 hover:text-white transition-colors">Cost Calculator</Link></li>
              <li><Link to="/about" className="text-secondary-300 hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/kansas-wc-resources" className="text-secondary-300 hover:text-white transition-colors">Kansas WC Resources</Link></li>
              <li><Link to="/missouri-wc-resources" className="text-secondary-300 hover:text-white transition-colors">Missouri WC Resources</Link></li>
              <li><Link to="/blog" className="text-secondary-300 hover:text-white transition-colors">Legal AI Blog</Link></li>
              <li><Link to="/faq" className="text-secondary-300 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="text-secondary-300">Email: info@leximentis.ai</li>
              <li className="text-secondary-300">Phone: (123) 456-7890</li>
              <li><Link to="/book" className="btn btn-accent mt-4">Book a Demo</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-secondary-400">© {new Date().getFullYear()} LexiMentis. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-secondary-400 hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-secondary-400 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
