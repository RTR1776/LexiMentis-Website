import React from 'react';
import { Award, Book, Briefcase, CheckCircle, FileText, Gem, Star, Users } from 'lucide-react';
import profilePic from '../assets/profilePic.jpg'; // add this import line

const AboutPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 dark:from-blue-800 dark:to-indigo-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet the Expert Behind LexiMentis
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Combining 20+ years of deep legal expertise with cutting-edge AI technology to transform workers compensation practice.
            </p>
          </div>
        </div>
      </div>
      
      {/* Profile Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Column 1: Profile Image & Stats */}
            <div className="md:col-span-1">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-6 overflow-hidden">
                <img src={profilePic} alt="Profile" className="object-cover w-full h-full" />
                <div className="h-full w-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">LJ</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Experience</h3>
                    <p className="text-gray-600 dark:text-gray-400">17+ Years in Legal Operations</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Cases Managed</h3>
                    <p className="text-gray-600 dark:text-gray-400">500+ Law Firms, $500M+ Legal Spend</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <Award className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Education</h3>
                    <p className="text-gray-600 dark:text-gray-400">J.D., Washington University</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Column 2-3: Bio & Story */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">L.J. Cox</h2>
                <h3 className="text-xl text-blue-600 dark:text-blue-400 mb-6">Legal Operations & AI Consultant</h3>
                
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  <p>
                    With over 20 years of experience in legal operations and technology, I've dedicated my career to transforming how legal work gets done. My journey has taken me from practicing law at prestigious firms like Shook Hardy & Bacon to overseeing $500M+ in legal spend as Director of Legal Invoice Review at AIG.
                  </p>
                  <p>
                    Throughout my career, I've consistently identified opportunities to optimize legal processes, reduce costs, and improve outcomes. Now, I'm combining my deep legal expertise with cutting-edge AI technology to revolutionize workers compensation practice in Kansas.
                  </p>
                  <p>
                    My unique background bridges the gap between legal strategy and technology implementation. I understand firsthand the challenges that law firms, insurance companies, and businesses face in managing workers compensation cases efficiently while maintaining quality and compliance.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Kansas and Missouri Workers Compensation?</h3>
                
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  <p>
                   Workers Compensation law presents a unique opportunity for AI transformation. It's a form-driven specialty that requires consistent processes across similar cases. Many tasks currently handled by paralegals at significant cost can be automated through smart application of AI technology.
                  </p>
                  <p>
                    By focusing first on Kansas and Missouri, we can build a sophisticated system with deep expertise in one jurisdiction before expanding to others. This focused approach ensures our AI delivers truly valuable, reliable results rather than superficial assistance.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Vision</h3>
                
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  <p>
                    My vision is to create an AI assistant that serves as a true force multiplier for legal professionals handling workers compensation cases. By automating routine tasks, extracting critical information from documents, completing forms, and providing reliable guidance, we can dramatically reduce the administrative burden while improving consistency and quality.
                  </p>
                  <p>
                    This isn't about replacing human judgment - it's about freeing legal professionals to focus on the high-value aspects of their work while reducing costs and improving outcomes for all stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expertise & Skills Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Expertise & Technical Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <Briefcase className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Legal Operations</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">E-Billing & Matter Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Vendor & Stakeholder Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Contract Negotiation & Process Optimization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Legal Technology Implementation</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <Gem className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">AI & Technical Skills</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">AI & Prompt Engineering</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">LLM Fine-Tuning & RAG Development</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Python Programming for AI/LLM Workflows</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">RESTful API Integration</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <Book className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Legal Practice</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Products Liability Defense</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Complex Litigation Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Legal Research & Analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Motion Practice & Trial Preparation</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <Users className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Leadership</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Team Management & Development</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Strategic Planning & Implementation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Project Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Change Management</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <Star className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Analytics</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Data Analysis & Reporting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Business Intelligence Tools</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Process Optimization Metrics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">Performance Monitoring Systems</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col">
              <div className="flex-grow">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 w-16 h-16 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">WC</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Kansas Expertise</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Specialized knowledge of Kansas-specific workers compensation regulations, procedures, and precedents, combined with a comprehensive database of decisions and forms.
                </p>
              </div>
              <div>
                <button className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200">
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Career Highlights Timeline */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Career Highlights</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 lg:left-1/2 h-full w-0.5 bg-blue-100 dark:bg-blue-900 transform -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {/* 2024 - Present */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 text-right hidden lg:block">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Legal Operations & AI Consultant</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Self-Employed</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Designing AI-driven workflows and implementing RAG pipelines for specialized legal tasks.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  <span className="text-xs">Now</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Legal Operations & AI Consultant</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Self-Employed</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Designing AI-driven workflows and implementing RAG pipelines for specialized legal tasks.
                  </p>
                </div>
              </div>
              
              {/* 2022 - 2024 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Legal Spend Management Specialist</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">EMC Insurance</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Oversaw $50M+ in legal spend and 500+ law firms, implementing data-driven reporting frameworks.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  <span className="text-xs">2022</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 text-left hidden lg:block">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Legal Spend Management Specialist</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">EMC Insurance</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Oversaw $50M+ in legal spend and 500+ law firms, implementing data-driven reporting frameworks.
                  </p>
                </div>
              </div>
              
              {/* 2018 - 2022 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 text-right hidden lg:block">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Director of Legal Invoice Review</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">AIG</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Led team of 10 professionals overseeing $500M+ in annual legal bill review, doubling savings through analytics.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  <span className="text-xs">2018</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Director of Legal Invoice Review</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">AIG</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Led team of 10 professionals overseeing $500M+ in annual legal bill review, doubling savings through analytics.
                  </p>
                </div>
              </div>
              
              {/* 2007 - 2018 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Legal Auditor</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">AIG</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Conducted detailed audits of panel and staff counsel firms, recovering millions in savings.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  <span className="text-xs">2007</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 text-left hidden lg:block">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Legal Auditor</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">AIG</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Conducted detailed audits of panel and staff counsel firms, recovering millions in savings.
                  </p>
                </div>
              </div>
              
              {/* 2000 - 2007 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 text-right hidden lg:block">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Associate Attorney</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Law Firm Practice</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practiced at Shook Hardy & Bacon and Rasmussen Willis, focusing on complex litigation and product liability.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  <span className="text-xs">2000</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Associate Attorney</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Law Firm Practice</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practiced at Shook Hardy & Bacon and Rasmussen Willis, focusing on complex litigation and product liability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-blue-50 dark:bg-blue-900/30">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Transform Your Workers Comp Practice?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Schedule a personalized consultation to see how my expertise and AI solutions can reduce your administrative burden and improve outcomes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition duration-200">
              Book a Call
            </button>
            <button className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium rounded-lg shadow border border-blue-200 dark:border-blue-700 transition duration-200">
              Try the AI Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;