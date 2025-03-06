import React, { useState } from 'react';
import { Send, Download, RefreshCw, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIDemo = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Welcome to the Kansas and Missouri Workers Compensation AI Assistant demo. You can ask questions about workers compensation law for Kansas or Missouri, procedures, or try uploading a sample document for analysis.'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    if (usageCount >= 5) {
      setShowLimitWarning(true);
      return;
    }
    
    // Add user's message to conversation
    const newMessages = [
      ...messages,
      { role: 'user', content: inputValue }
    ];
    setMessages(newMessages);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Call the demo endpoint that integrates Datastax Langflow
      const response = await fetch('/api/demo-langflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMessages })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      // Assume the API returns { reply: "..." }
      const reply = data.reply || 'Sorry, no response available at the moment.';
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Error fetching demo response:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'There was an error processing your request. Please try again later.' }
      ]);
    } finally {
      setIsProcessing(false);
      setUsageCount(prev => prev + 1);
    }
  };

  const resetDemo = () => {
    setMessages([{
      role: 'system',
      content: 'Welcome to the Kansas and Missouri Workers Compensation AI Assistant demo. You can ask questions about workers compensation law for Kansas or Missouri, procedures, or try uploading a sample document for analysis.'
    }]);
    setUsageCount(0);
    setShowLimitWarning(false);
  };

  return (
    <div className="bg-neutral-50 dark:bg-secondary-900 min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-accent-800 to-accent-900 dark:from-accent-800 dark:to-secondary-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Try Our AI Workers Comp Assistant
            </h1>
            <p className="text-xl text-accent-100 mb-8">
              Experience how our AI can answer questions about Kansas and Missouri workers compensation laws, benefits, and procedures.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-secondary-700">
            {/* Chat Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-secondary-700 bg-accent-50 dark:bg-accent-900/30 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-neutral-100">AI Workers Comp Assistant</h2>
                <p className="text-secondary-600 dark:text-neutral-300">
                  Demo version - Try asking about Kansas and Missouri WC laws, benefits, or forms
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center text-sm">
                <span className="text-secondary-500 dark:text-neutral-400">
                  Usage: {usageCount}/5 queries
                </span>
                <button 
                  onClick={resetDemo}
                  className="ml-4 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-secondary-700 transition-colors"
                  title="Reset demo"
                >
                  <RefreshCw className="h-4 w-4 text-secondary-600 dark:text-neutral-400" />
                </button>
              </div>
            </div>
            
            {/* Messages Container */}
            <div className="p-6 h-96 overflow-y-auto flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-xl p-4 ${
                      message.role === 'user' 
                        ? 'bg-accent-800 text-white' 
                        : message.role === 'system'
                          ? 'bg-neutral-100 dark:bg-secondary-700 text-secondary-800 dark:text-neutral-200 border border-neutral-200 dark:border-secondary-600'
                          : 'bg-neutral-200 dark:bg-secondary-600 text-secondary-800 dark:text-neutral-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-neutral-200 dark:bg-secondary-600 text-secondary-800 dark:text-neutral-200 rounded-xl p-4 max-w-3/4 flex items-center">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-secondary-600 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-secondary-600 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-2 w-2 bg-secondary-600 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {showLimitWarning && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-300 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      You've reached the maximum number of queries for this demo. Please book a call to learn more about the full capabilities.
                    </p>
                    <div className="mt-3">
                      <button 
                        className="text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-600 dark:hover:text-yellow-200 underline"
                        onClick={resetDemo}
                      >
                        Reset Demo
                      </button>
                      <Link 
                        to="/book"
                        className="ml-4 text-sm font-medium bg-accent-800 hover:bg-accent-700 text-white py-1 px-3 rounded"
                      >
                        Book a Call
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <form onSubmit={handleSubmit} className="border-t border-neutral-200 dark:border-secondary-700 p-4">
              <div className="flex items-center">
                <button 
                  type="button"
                  className="p-2 text-secondary-500 dark:text-neutral-400 hover:text-secondary-700 dark:hover:text-neutral-200 focus:outline-none"
                  title="Upload document"
                >
                  <Download className="h-5 w-5" />
                </button>
                
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about Kansas and Missouri workers compensation..."
                  className="flex-grow px-4 py-2 focus:outline-none bg-white dark:bg-secondary-800 text-secondary-800 dark:text-neutral-200"
                  disabled={isProcessing || showLimitWarning}
                />
                
                <button 
                  type="submit" 
                  className={`p-2 rounded-lg transition-colors ${
                    isProcessing || !inputValue.trim() || showLimitWarning
                      ? 'text-secondary-400 cursor-not-allowed'
                      : 'text-accent-800 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20'
                  }`}
                  disabled={isProcessing || !inputValue.trim() || showLimitWarning}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-2 flex justify-between items-center text-xs text-secondary-500 dark:text-neutral-400">
                <div className="flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  <span>
                    Demo mode: Responses are powered by Datastax Langflow vector database
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Your data is not stored</span>
                </div>
              </div>
            </form>
          </div>
          
          {/* Features Section */}
          <div className="mt-8 bg-white dark:bg-secondary-800 rounded-xl p-6 shadow-md border border-neutral-200 dark:border-secondary-700">
            <h3 className="text-xl font-bold text-secondary-900 dark:text-neutral-100 mb-4">What You Can Do With the Full Version</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <p className="text-secondary-700 dark:text-neutral-300">
                  Upload and analyze medical records automatically
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <p className="text-secondary-700 dark:text-neutral-300">
                  Auto-complete all standard Kansas and Missouri WC forms
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <p className="text-secondary-700 dark:text-neutral-300">
                  Analyze depositions and create summary profiles
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <p className="text-secondary-700 dark:text-neutral-300">
                  Generate case-specific recommendations
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <p className="text-secondary-700 dark:text-neutral-300">
                  Estimate benefit calculations accurately
                </p>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <p className="text-secondary-700 dark:text-neutral-300">
                  Access to comprehensive KS and MO WC database
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/book"
                className="px-6 py-3 bg-accent-800 hover:bg-accent-700 text-white font-medium rounded-lg transition duration-200"
              >
                Book a Full Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemo;