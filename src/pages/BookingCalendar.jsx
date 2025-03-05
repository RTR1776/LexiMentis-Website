import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Check, CalendarDays } from 'lucide-react';

const BookingCalendar = () => {
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', company: '', message: '' });
  const [apiError, setApiError] = useState(null);
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);

  // Load Calendly script
  useEffect(() => {
    // Remove any existing Calendly scripts to prevent duplicates
    const existingScript = document.querySelector('script[src*="calendly.com"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    
    script.onload = () => {
      console.log("Calendly script loaded successfully");
      setCalendlyLoaded(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load Calendly script");
      setApiError("Failed to load booking system. Please try again later.");
    };
    
    document.body.appendChild(script);
    return () => { 
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  // Function to open Calendly widget with improved configuration
  const openCalendlyWidget = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      try {
        window.Calendly.initPopupWidget({
          url: 'https://calendly.com/lj-cox-leximentis/30min',
          prefill: {
            name: contactInfo.name || '',
            email: contactInfo.email || '',
            customAnswers: {
              a1: contactInfo.company || 'Not provided',
              a2: contactInfo.message || 'No specific questions'
            }
          },
          utm: {
            utmSource: 'Website',
            utmMedium: 'Direct',
            utmCampaign: 'Booking'
          }
        });
        console.log("Calendly widget initialized");
      } catch (error) {
        console.error("Error initializing Calendly widget:", error);
        setApiError("There was an error opening the booking system. Please try refreshing the page.");
      }
    } else {
      console.error("Calendly widget not loaded");
      setApiError("Loading booking system. Please wait a moment...");
      
      // If script failed to load in useEffect, try again here
      const script = document.createElement('script');
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      
      script.onload = () => {
        console.log("Calendly script loaded on demand");
        setCalendlyLoaded(true);
        setTimeout(() => {
          // Try opening again after script loads
          if (window.Calendly) {
            window.Calendly.initPopupWidget({
              url: 'https://calendly.com/lj-cox-leximentis/30min',
              prefill: {
                name: contactInfo.name || '',
                email: contactInfo.email || '',
              }
            });
          }
        }, 1000);
      };
      
      document.body.appendChild(script);
    }
  };

  // Add option to use Calendly inline
  const renderCalendlyInline = () => {
    if (calendlyLoaded && typeof window !== 'undefined' && window.Calendly) {
      return (
        <div 
          className="calendly-inline-widget" 
          data-url="https://calendly.com/lj-cox-leximentis/30min"
          style={{ minWidth: '320px', height: '700px' }} 
        />
      );
    }
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-blue-600">Loading calendar...</p>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Book a Demo Call</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule a personalized demo to see how our AI Workers Comp Assistant can transform your practice and reduce administrative burden.
          </p>
          
          {/* Add a prominent Calendly button at the top */}
          <button
            onClick={openCalendlyWidget}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 inline-flex items-center"
            disabled={!calendlyLoaded}
          >
            <CalendarDays className="mr-2 h-5 w-5" />
            {calendlyLoaded ? "Schedule Your Demo Call" : "Loading Scheduler..."}
            {!calendlyLoaded && <span className="ml-2 animate-pulse">&bull;&bull;&bull;</span>}
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-3xl mx-auto">
          {/* Display API errors */}
          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
              <div className="flex">
                <div>
                  <p className="text-red-700">{apiError}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Select a time that works for you</h3>
          </div>
          
          {/* Calendly inline widget */}
          <div className="p-0">
            {renderCalendlyInline()}
          </div>
          
          {/* Optional contact info collection */}
          <div className="p-6 border-t border-gray-200">
            <h4 className="text-md font-medium mb-4">Your information (optional)</h4>
            <p className="text-sm text-gray-600 mb-4">
              You can provide your information here before scheduling, or fill it in during the Calendly booking process.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactInfo.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={contactInfo.company}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your company"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <input
                  type="text"
                  id="message"
                  name="message"
                  value={contactInfo.message}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any specific questions?"
                />
              </div>
            </div>
            
            <button
              onClick={openCalendlyWidget}
              className="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 inline-flex items-center justify-center"
              disabled={!calendlyLoaded}
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              Schedule with Your Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;