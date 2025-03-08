import React from 'react';
import { ArrowRight, CheckCircle, Clock, DollarSign } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content - Text */}
          <article className="md:w-1/2 space-y-6">
            <div
              className="inline-block px-3 py-1 rounded-full bg-blue-800 text-blue-100 text-sm font-medium mb-2"
              aria-label="First-of-its-kind for Kansas Workers Compensation"
            >
              First-of-its-kind for Kansas Workers Compensation
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Meet Your AI <span className="text-blue-300">Workers Comp Paralegal</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Leverage 17+ years of legal expertise combined with cutting-edge AI to streamline
              workers compensation cases, reduce costs, and improve outcomes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                className="px-6 py-3 text-base font-medium rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-200 flex items-center justify-center"
                aria-label="Book a Demo"
              >
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                type="button"
                className="px-6 py-3 text-base font-medium rounded-lg bg-transparent border border-blue-400 hover:bg-blue-800 transition duration-200"
                aria-label="Try the AI Assistant"
              >
                Try the AI Assistant
              </button>
            </div>
          </article>
          
          {/* Right Content - Stats Cards */}
          <aside className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <DollarSign className="h-10 w-10 text-blue-300 mb-3" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-1">Reduce Costs</h3>
              <p className="text-blue-100">
                Cut legal admin expenses by up to 70% with automated form processing
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Clock className="h-10 w-10 text-blue-300 mb-3" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-1">Save Time</h3>
              <p className="text-blue-100">
                Process documents in minutes instead of hours
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 sm:col-span-2">
              <CheckCircle className="h-10 w-10 text-blue-300 mb-3" aria-hidden="true" />
              <h3 className="text-xl font-bold mb-1">Enhanced Accuracy</h3>
              <p className="text-blue-100">
                Powered by RAG technology with thousands of Kansas WC decisions, statutes, and forms
              </p>
            </div>
          </aside>
        </div>
      </div>
      
      {/* Trusted By Section */}
      <footer className="bg-blue-950/70 py-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <p className="text-center text-blue-300 text-sm font-medium mb-4">
            BUILT BY LEGAL EXPERTISE YOU CAN TRUST
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            <span className="text-white/70 font-semibold text-lg">17+ Years Legal Experience</span>
            <span className="text-white/70 font-semibold text-lg">Former Director at AIG</span>
            <span className="text-white/70 font-semibold text-lg">Managed $500M+ in Legal Billing</span>
            <span className="text-white/70 font-semibold text-lg">Kansas Legal Expert</span>
            {/* Add loading="lazy" to improve page load speed */}
            <img 
              src="/client-logo-1.svg" 
              alt="Law firm client of LexiMentis" 
              className="h-8 md:h-10 opacity-70" 
              loading="lazy" 
              width="160" 
              height="40"
            />
            <img 
              src="/client-logo-2.svg" 
              alt="Insurance company using LexiMentis AI" 
              className="h-8 md:h-10 opacity-70" 
              loading="lazy" 
              width="160" 
              height="40"
            />
            <img 
              src="/client-logo-3.svg" 
              alt="Legal technology partner of LexiMentis" 
              className="h-8 md:h-10 opacity-70" 
              loading="lazy" 
              width="160" 
              height="40"
            />
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Hero;