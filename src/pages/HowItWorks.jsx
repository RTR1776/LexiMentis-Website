import React from 'react';
import { Database, FileText, Brain, Cpu, ClipboardCheck, MessageSquare } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">How Our AI Workers Comp System Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Powered by advanced Retrieval-Augmented Generation (RAG) technology and fine-tuned LLMs specifically for Kansas and Missouri Workers Compensation law.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Specialized Knowledge Base</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Our system is built on thousands of Kansas and Missouri Workers Compensation appeal decisions, statutes, forms, and legal precedents.
            </p>
            <div className="text-sm font-medium text-blue-600">Comprehensive • Current • State-Specific</div>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Document Processing</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Upload medical records, depositions, emails, or other case documents. Our AI extracts and organizes relevant information automatically.
            </p>
            <div className="text-sm font-medium text-blue-600">Fast • Accurate • Secure</div>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">RAG Technology</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Retrieval-Augmented Generation combines the power of large language models with precise retrieval from our specialized database.
            </p>
            <div className="text-sm font-medium text-blue-600">Contextual • Relevant • Evidence-Based</div>
          </div>
          
          {/* Step 4 */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <Cpu className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Model Approach</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Different AI models handle specialized tasks like medical record analysis, document extraction, and legal form preparation.
            </p>
            <div className="text-sm font-medium text-blue-600">Specialized • Optimized • Efficient</div>
          </div>
          
          {/* Step 5 */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Forms & Profiles</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              The system automatically completes standard Workers Compensation forms and creates detailed claimant profiles with critical information.
            </p>
            <div className="text-sm font-medium text-blue-600">Time-Saving • Standardized • Thorough</div>
          </div>
          
          {/* Step 6 */}
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Assistance</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Ask questions about Kansas and Missouri Workers Compensation law, procedures, or case-specific details and receive informed, accurate answers.
            </p>
            <div className="text-sm font-medium text-blue-600">Responsive • Educational • Actionable</div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition duration-200">
            See the AI in Action
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;