import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Book, Briefcase, CheckCircle, FileText, Gem, Star, Users } from 'lucide-react';
import profilePic from '../assets/profilePic.jpg'; 
import SEO from '../components/SEO';

const AboutPage = () => {
  // Schema for AboutPage
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About LexiMentis",
    "description": "Learn about LexiMentis, an AI-powered workers' compensation solution backed by 20+ years of legal expertise.",
    "url": "https://www.leximentis.com/about",
    "mainEntity": {
      "@type": "Person",
      "name": "LJ Cox",
      "jobTitle": "Legal Operations & AI Consultant",
      "description": "20+ years of experience in legal operations and technology"
    }
  };

  return (
    <div className="bg-neutral-50 dark:bg-secondary-900 min-h-screen">
      <SEO 
        title="About | 20+ Years of Legal Expertise" 
        description="Meet the founder of LexiMentis with over 20 years of legal operations experience, specializing in workers' compensation law in Kansas and Missouri."
        keywords="legal operations expert, workers compensation expert, Kansas workers comp, Missouri workers comp, legal AI consultant"
        canonical="/about"
        schema={schema}
      />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent-800 to-accent-900 dark:from-accent-800 dark:to-secondary-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet the Expert Behind LexiMentis
            </h1>
            <p className="text-xl text-accent-100 mb-8">
              Combining 20+ years of deep legal expertise with cutting-edge AI technology to transform workers compensation practice.
            </p>
          </div>
        </div>
      </div>
      
      {/* Profile Section */}
      <div className="py-16 bg-white dark:bg-secondary-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Column 1: Profile Image & Stats */}
            <div className="md:col-span-1">
              <div className="aspect-square bg-neutral-200 dark:bg-secondary-700 rounded-xl mb-6 overflow-hidden">
                <img src={profilePic} alt="Profile" className="object-cover w-full h-full" />
                <div className="h-full w-full bg-gradient-to-br from-accent-600 to-accent-800 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">LJ</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/30 rounded-lg">
                  <Briefcase className="h-5 w-5 text-accent-800 dark:text-accent-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-secondary-800 dark:text-white">Experience</h3>
                    <p className="text-secondary-600 dark:text-neutral-400">20+ Years in Legal Operations</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-secondary-800 dark:text-white">Legal Spend Managed</h3>
                    <p className="text-secondary-600 dark:text-neutral-400">1,000+ Law Firms, $500M+ Legal Spend</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/30 rounded-lg">
                  <Award className="h-5 w-5 text-accent-800 dark:text-accent-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-secondary-800 dark:text-white">Education</h3>
                    <p className="text-secondary-600 dark:text-neutral-400">J.D., Washington University</p>
                    <p className="text-secondary-600 dark:text-neutral-400">B.S., University of Missouri</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Column 2-3: Bio & Story */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">L.J. Cox</h2>
                <h3 className="text-xl text-accent-800 dark:text-accent-400 mb-6">Legal Operations & AI Consultant</h3>
                
                <div className="prose prose-lg dark:prose-invert max-w-none text-secondary-600 dark:text-neutral-300">
                  <p>
                    With over 20 years of experience in legal operations and technology, I've dedicated my career to transforming how legal work gets done. My journey has taken me from practicing law at prestigious firms like Shook Hardy & Bacon to overseeing $500M+ in legal spend as Director of Legal Invoice Review at AIG.
                  </p>
                  <p>
                    Throughout my career, I've consistently identified opportunities to optimize legal processes, reduce costs, and improve outcomes. Now, I'm combining my deep legal expertise with cutting-edge AI technology to revolutionize workers compensation practice in Missouri and Kansas.
                  </p>
                  <p>
                    My unique background bridges the gap between legal strategy and technology implementation. I understand firsthand the challenges that law firms, insurance companies, and businesses face in managing workers compensation cases efficiently while maintaining quality and compliance.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 dark:border-secondary-700 pt-8">
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">Why Kansas and Missouri Workers Compensation?</h3>
                
                <div className="prose prose-lg dark:prose-invert max-w-none text-secondary-600 dark:text-neutral-300">
                  <p>
                   Workers Compensation law presents a unique opportunity for AI transformation. It's a statute and form-driven specialty that requires consistent processes across similar cases. Many tasks currently handled by paralegals at significant cost can be automated through smart application of AI technology.
                  </p>
                  <p>
                    By focusing first on Kansas and Missouri, we can build a sophisticated system with deep expertise in two jurisdictions before expanding to others. This focused approach ensures our AI delivers truly valuable, reliable results rather than superficial assistance.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 dark:border-secondary-700 pt-8">
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">The Vision</h3>
                
                <div className="prose prose-lg dark:prose-invert max-w-none text-secondary-600 dark:text-neutral-300">
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
      <div className="py-16 bg-neutral-50 dark:bg-secondary-900">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-12 text-center">Expertise & Technical Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-md border border-neutral-200 dark:border-secondary-700">
              <Briefcase className="h-10 w-10 text-accent-800 dark:text-accent-400 mb-4" />
              <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-3">Legal Operations</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">E-Billing & Matter Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Vendor & Stakeholder Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Contract Negotiation & Process Optimization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Legal Technology Implementation</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-md border border-neutral-200 dark:border-secondary-700">
              <Gem className="h-10 w-10 text-accent-800 dark:text-accent-400 mb-4" />
              <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-3">AI & Technical Skills</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">AI & Prompt Engineering</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">LLM Fine-Tuning & RAG Development</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Python Programming for AI/LLM Workflows</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">RESTful API Integration</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-md border border-neutral-200 dark:border-secondary-700">
              <Book className="h-10 w-10 text-accent-800 dark:text-accent-400 mb-4" />
              <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-3">Legal Practice</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Products Liability Defense</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Complex Litigation Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Legal Research & Analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Motion Practice & Trial Preparation</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-md border border-neutral-200 dark:border-secondary-700">
              <Users className="h-10 w-10 text-accent-800 dark:text-accent-400 mb-4" />
              <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-3">Leadership</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Team Management & Development</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Strategic Planning & Implementation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Project Management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Change Management</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-md border border-neutral-200 dark:border-secondary-700">
              <Star className="h-10 w-10 text-accent-800 dark:text-accent-400 mb-4" />
              <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-3">Analytics</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Data Analysis & Reporting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Business Intelligence Tools</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Process Optimization Metrics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-600 dark:text-neutral-300">Performance Monitoring Systems</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-md border border-neutral-200 dark:border-secondary-700 flex flex-col">
              <div className="flex-grow">
                <div className="rounded-full bg-accent-100 dark:bg-accent-900/30 w-16 h-16 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-accent-800 dark:text-accent-400">WC</span>
                </div>
                <h3 className="text-xl font-bold text-secondary-800 dark:text-white mb-3">Kansas Expertise</h3>
                <p className="text-secondary-600 dark:text-neutral-300 mb-4">
                  Specialized knowledge of Missouri and Kansas specific workers compensation regulations, procedures, and precedents, combined with a comprehensive database of decisions and forms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Career Highlights Timeline */}
      <div className="py-16 bg-white dark:bg-secondary-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-12 text-center">Career Highlights</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 lg:left-1/2 h-full w-0.5 bg-accent-100 dark:bg-accent-900 transform -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {/* 2024 - Present */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 text-right hidden lg:block">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Legal Operations & AI Consultant</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">LexiMentis</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Designing AI-driven workflows and implementing RAG pipelines for specialized legal tasks.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-accent-800 text-white font-bold">
                  <span className="text-xs">Now</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Legal Operations & AI Consultant</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">LexiMentis</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Designing AI-driven workflows and implementing RAG pipelines for specialized legal tasks.
                  </p>
                </div>
              </div>
              
              {/* 2022 - 2024 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Legal Spend Management Specialist</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">EMC Insurance</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Oversaw $50M+ in legal spend and 500+ law firms, implementing data-driven reporting frameworks.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-accent-800 text-white font-bold">
                  <span className="text-xs">2022</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 text-left hidden lg:block">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Legal Spend Management Specialist</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">EMC Insurance</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Oversaw $50M+ in legal spend and 500+ law firms, implementing data-driven reporting frameworks.
                  </p>
                </div>
              </div>
              
              {/* 2018 - 2022 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 text-right hidden lg:block">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Director of Legal Invoice Review</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">AIG</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Led team of 10 professionals overseeing $500M+ in annual legal bill review, doubling savings through analytics.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-accent-800 text-white font-bold">
                  <span className="text-xs">2018</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Director of Legal Invoice Review</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">AIG</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Led team of 10 professionals overseeing $500M+ in annual legal bill review, doubling savings through analytics.
                  </p>
                </div>
              </div>
              
              {/* 2007 - 2018 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Legal Auditor</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">AIG</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Conducted detailed audits of panel and staff counsel firms, recovering millions in savings.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-accent-800 text-white font-bold">
                  <span className="text-xs">2007</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 text-left hidden lg:block">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Legal Auditor</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">AIG</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Conducted detailed audits of panel and staff counsel firms, recovering millions in savings.
                  </p>
                </div>
              </div>
              
              {/* 2000 - 2007 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 lg:pr-16 text-right hidden lg:block">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Associate Attorney</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">Law Firm Practice</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Practiced at Shook Hardy & Bacon and Rasmussen Willis, focusing on complex litigation and product liability.
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-accent-800 text-white font-bold">
                  <span className="text-xs">2000</span>
                </div>
                
                <div className="lg:w-1/2 lg:pl-16 block lg:hidden mt-4 lg:mt-0">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-white">Associate Attorney</h3>
                  <p className="text-accent-800 dark:text-accent-400 font-medium">Law Firm Practice</p>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-2">
                    Practiced at Shook Hardy & Bacon and Rasmussen Willis, focusing on complex litigation and product liability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-accent-50 dark:bg-accent-900/30">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">Ready to Transform Your Workers Comp Practice?</h2>
          <p className="text-lg text-secondary-600 dark:text-neutral-300 mb-8">
            Schedule a personalized consultation to see how my expertise and AI solutions can reduce your administrative burden and improve outcomes.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/book"
              className="px-8 py-3 bg-accent-800 hover:bg-accent-700 text-white font-medium rounded-lg shadow-lg transition duration-200 btn-accent"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;