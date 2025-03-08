import React from 'react';
import { Database, FileText, Brain, Cpu, ClipboardCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="bg-neutral-50 dark:bg-secondary-900 min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-accent-800 to-accent-900 dark:from-accent-800 dark:to-secondary-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How Our AI Workers Comp System Works
            </h1>
            <p className="text-xl text-accent-100 mb-8">
              Powered by advanced Retrieval-Augmented Generation (RAG) technology and fine-tuned LLMs specifically for Kansas and Missouri Workers Compensation law.
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-neutral-white mb-3">Specialized Knowledge Base</h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Our system is built on thousands of Kansas and Missouri Workers Compensation appeal decisions, statutes, forms, and legal precedents.
              </p>
              <div className="text-sm font-medium text-accent-800 dark:text-accent-400">Comprehensive • Current • State-Specific</div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-neutral-white mb-3">Document Processing</h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Upload medical records, depositions, emails, or other case documents. Our AI extracts and organizes relevant information automatically.
              </p>
              <div className="text-sm font-medium text-accent-800 dark:text-accent-400">Fast • Accurate • Secure</div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-neutral-white mb-3">RAG Technology</h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Retrieval-Augmented Generation combines the power of large language models with precise retrieval from our specialized database.
              </p>
              <div className="text-sm font-medium text-accent-800 dark:text-accent-400">Contextual • Relevant • Evidence-Based</div>
            </div>
            
            {/* Step 4 */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <Cpu className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-neutral-white mb-3">Multi-Model Approach</h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Different AI models handle specialized tasks like medical record analysis, document extraction, and legal form preparation.
              </p>
              <div className="text-sm font-medium text-accent-800 dark:text-accent-400">Specialized • Optimized • Efficient</div>
            </div>
            
            {/* Step 5 */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <ClipboardCheck className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-neutral-white mb-3">Automated Forms & Profiles</h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                The system automatically completes standard Workers Compensation forms and creates detailed claimant profiles with critical information.
              </p>
              <div className="text-sm font-medium text-accent-800 dark:text-accent-400">Time-Saving • Standardized • Thorough</div>
            </div>
            
            {/* Step 6 */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-neutral-white mb-3">Interactive Assistance</h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Ask questions about Kansas and Missouri Workers Compensation law, procedures, or case-specific details and receive informed, accurate answers.
              </p>
              <div className="text-sm font-medium text-accent-800 dark:text-accent-400">Responsive • Educational • Actionable</div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/demo" className="px-8 py-4 btn-accent text-white font-medium rounded-lg shadow-lg transition duration-200">
              See the AI in Action
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;