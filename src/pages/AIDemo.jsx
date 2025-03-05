import React, { useState } from 'react';
import { Send, Download, RefreshCw, Info, AlertTriangle, CheckCircle } from 'lucide-react';

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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900 flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Workers Comp Assistant</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Demo version - Try asking about Kansas and Missouri WC laws, benefits, or forms
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Usage: {usageCount}/5 queries
              </span>
              <button 
                onClick={resetDemo}
                className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Reset demo"
              >
                <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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
                      ? 'bg-blue-600 text-white' 
                      : message.role === 'system'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl p-4 max-w-3/4 flex items-center">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="h-2 w-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {showLimitWarning && (
              <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-700 p-4 flex items-start">
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
                    <button 
                      className="ml-4 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                      onClick={() => window.location.href = '/booking-calendar'}
                    >
                      Book a Call
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <button 
                type="button"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                title="Upload document"
              >
                <Download className="h-5 w-5" />
              </button>
              
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about Kansas and Missouri workers compensation..."
                className="flex-grow px-4 py-2 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                disabled={isProcessing || showLimitWarning}
              />
              
              <button 
                type="submit" 
                className={`p-2 rounded-full ${
                  isProcessing || !inputValue.trim() || showLimitWarning
                    ? 'text-gray-400 dark:text-gray-600'
                    : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
                }`}
                disabled={isProcessing || !inputValue.trim() || showLimitWarning}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
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
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">What You Can Do With the Full Version</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Upload and analyze medical records automatically
              </p>
            </div>
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Auto-complete all standard Kansas and Missouri WC forms
              </p>
            </div>
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Analyze depositions and create summary profiles
              </p>
            </div>
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Generate case-specific recommendations
              </p>
            </div>
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Estimate benefit calculations accurately
              </p>
            </div>
            <div className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Access to comprehensive KS and MO WC database
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              onClick={() => window.location.href = '/booking-calendar'}
            >
              Book a Full Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemo;