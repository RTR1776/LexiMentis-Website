import React from 'react';
import { Link } from 'react-router-dom';
import { Database, FileText, Brain, Cpu, ClipboardCheck, MessageSquare, Network, Lock, Zap } from 'lucide-react';
import SEO from '../components/SEO';

const HowItWorks = () => {
  // Schema for HowItWorks page
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "How LexiMentis Works",
    "description": "Learn how LexiMentis uses Model Context Protocol to streamline workers' compensation case management",
    "url": "https://www.leximentis.com/how-it-works",
    "mainEntity": {
      "@type": "Service",
      "name": "LexiMentis AI Workers' Compensation Assistant",
      "description": "AI-powered solution for workers' compensation attorneys in Kansas and Missouri"
    }
  };

  return (
    <div className="bg-neutral-50 dark:bg-secondary-900 min-h-screen">
      <SEO 
        title="How It Works | Model Context Protocol Technology" 
        description="Discover how LexiMentis uses Model Context Protocol to provide secure, intelligent AI assistance for workers' compensation attorneys in Kansas and Missouri."
        keywords="Model Context Protocol, AI legal assistant, workers compensation technology, legal document analysis, medical record analysis"
        canonical="/how-it-works"
        schema={schema}
      />
      
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-accent-800 to-accent-900 dark:from-accent-800 dark:to-secondary-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Model Context Protocol Powers Our AI Workers Comp Solution
            </h1>
            <p className="text-xl text-accent-100 mb-8">
              LexiMentis leverages the open Model Context Protocol (MCP) to create a secure, intelligent ecosystem that transforms workers compensation practice.
            </p>
          </div>
        </div>
      </div>
      
      {/* MCP Overview Section */}
      <div className="py-16 bg-white dark:bg-secondary-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">
              The Model Context Protocol Advantage
            </h2>
            <p className="text-lg text-secondary-600 dark:text-neutral-300 max-w-3xl mx-auto">
              MCP creates standardized interactions between LLMs and specialized knowledge domains, enabling LexiMentis to deliver powerful, secure AI capabilities while maintaining complete control of your sensitive data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <Network className="h-16 w-16 text-accent-600 dark:text-accent-400 mb-6" />
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                Seamless AI Integration
              </h3>
              <p className="text-secondary-600 dark:text-neutral-300">
                MCP provides a standardized way for applications to provide context to large language models, similar to how USB-C provides a standardized way to connect devices. This enables LexiMentis to seamlessly integrate with Claude and other AI models without compromising security.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <Lock className="h-16 w-16 text-accent-600 dark:text-accent-400 mb-6" />
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
                Secure Data Handling
              </h3>
              <p className="text-secondary-600 dark:text-neutral-300">
                Unlike standard AI integrations, MCP keeps your sensitive case data within your control. Our specialized MCP servers expose specific capabilities to AI models without exposing the underlying data, maintaining client confidentiality and compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Architecture Diagram */}
      <div className="py-16 bg-accent-50 dark:bg-accent-900/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-6">
              LexiMentis MCP Architecture
            </h2>
            <p className="text-lg text-secondary-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Our platform is built on a network of specialized MCP servers, each focused on specific aspects of workers compensation practice.
            </p>
          </div>
          <div className="bg-white dark:bg-secondary-800 p-8 rounded-xl shadow-lg mb-12">
            <img 
              src="/improved-mcp-diagram.svg" 
              alt="LexiMentis Model Context Protocol Architecture for Workers Compensation AI" 
              className="w-full h-auto"
              aria-describedby="mcp-diagram-description"
              loading="lazy"
              width="1200"
              height="800"
            />
            <p id="mcp-diagram-description" className="sr-only">
              Comprehensive diagram showing how LexiMentis Model Context Protocol architecture connects specialized servers for document processing, knowledge base, medical analysis, forms automation, workflow optimization, and AI assistant capabilities for workers compensation cases.
            </p>
          </div>
        </div>
      </div>
      
      {/* MCP Components Section */}
      <div className="py-16 bg-white dark:bg-secondary-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-12 text-center">
            Our Specialized MCP Servers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Document MCP */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">
                Document MCP
              </h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Intelligent document storage, OCR processing, and retrieval across all types of workers comp documents, from medical records to legal filings.
              </p>
            </div>
            
            {/* Knowledge Base MCP */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">
                Knowledge Base MCP
              </h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Specialized database of Kansas and Missouri workers compensation law, regulations, and case precedents, providing accurate, jurisdiction-specific knowledge.
              </p>
            </div>
            
            {/* Medical Analysis MCP */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">
                Medical Analysis MCP
              </h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Specialized processing of medical records, extracting diagnoses, treatment plans, work restrictions, and impairment ratings automatically.
              </p>
            </div>
            
            {/* Forms MCP */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <ClipboardCheck className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">
                Forms MCP
              </h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Automated completion of state-specific workers compensation forms, integrating data from case files and ensuring compliance with filing requirements.
              </p>
            </div>
            
            {/* Workflow MCP */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <Cpu className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">
                Workflow MCP
              </h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Intelligent case management with automated deadline tracking, task generation, and workflow optimization based on case status and requirements.
              </p>
            </div>
            
            {/* Assistant MCP */}
            <div className="bg-neutral-white dark:bg-secondary-800 rounded-xl p-8 shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-accent-900/30 flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-accent-800 dark:text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">
                Assistant MCP
              </h3>
              <p className="text-secondary-600 dark:text-neutral-300 mb-4 flex-grow">
                Interactive AI assistant that helps with research questions, document drafting, and strategic planning, drawing on all other MCP servers for comprehensive support.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-lg text-secondary-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8">
              Together, these MCP servers create an integrated ecosystem that dramatically reduces administrative burden, accelerates case processing, and improves outcomes for workers compensation attorneys and their clients.
            </p>
            <Link
              to="/demo"
              className="px-8 py-4 btn-accent text-white font-medium rounded-lg shadow-lg transition duration-200"
            >
              See the AI in Action
            </Link>
          </div>
        </div>
      </div>
      
      {/* How It Works in Practice */}
      <div className="py-16 bg-accent-50 dark:bg-accent-900/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-12 text-center">
            How It Works in Practice
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
                <Zap className="h-6 w-6 text-accent-600 dark:text-accent-400 mr-3" />
                Document Processing Example
              </h3>
              
              <ol className="space-y-4">
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">1.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    Upload medical records, depositions, or other case documents to the platform
                  </p>
                </li>
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">2.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    Document MCP processes files using OCR and classification
                  </p>
                </li>
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">3.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    Medical Analysis MCP extracts relevant medical information
                  </p>
                </li>
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">4.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    Knowledge Base MCP links findings to relevant legal standards
                  </p>
                </li>
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">5.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    Assistant MCP provides a comprehensive summary with legal implications
                  </p>
                </li>
              </ol>
            </div>
            
            <div className="bg-white dark:bg-secondary-800 rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center">
                <Zap className="h-6 w-6 text-accent-600 dark:text-accent-400 mr-3" />
                Legal Research Example
              </h3>
              
              <ol className="space-y-4">
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">1.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    Ask a question about workers comp law in Kansas or Missouri
                  </p>
                </li>
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">2.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    Assistant MCP routes the question to the Knowledge Base MCP
                  </p>
                </li>
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">3.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    Knowledge Base MCP retrieves relevant statutes, regulations, and cases
                  </p>
                </li>
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">4.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    Assistant MCP formulates a comprehensive answer with proper citations
                  </p>
                </li>
                <li className="flex">
                  <span className="font-bold text-accent-600 dark:text-accent-400 mr-2">5.</span>
                  <p className="text-secondary-600 dark:text-neutral-300">
                    You receive an accurate, jurisdiction-specific response in seconds
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;