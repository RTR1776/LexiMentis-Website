import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTextColorClasses } from '../../utils/themeUtils';
import { 
  Brain, 
  FileText, 
  Clock, 
  Database, 
  ClipboardCheck, 
  ChatBubble 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const { darkMode } = useTheme();
  
  const features = [
    {
      title: "Advanced Document Analysis",
      description: "Automatically process medical records, depositions, and other case documents with intelligent data extraction.",
      icon: FileText,
      color: "text-primary-500 dark:text-primary-400"
    },
    {
      title: "Medical Record Summarization",
      description: "Extract key medical information from records, identifying diagnoses, treatments, and work restrictions.",
      icon: Brain,
      color: "text-accent-600 dark:text-accent-400"
    },
    {
      title: "Automated Form Completion",
      description: "Pre-fill Kansas and Missouri workers compensation forms with case data in seconds.",
      icon: ClipboardCheck,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Legal Research Assistant",
      description: "Access comprehensive Kansas and Missouri workers compensation knowledge base for accurate guidance.",
      icon: Database,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Streamlined Workflows",
      description: "Reduce administrative tasks with automated deadline tracking and task generation.",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Expert AI Assistant",
      description: "Get intelligent answers to complex workers compensation questions specific to Kansas and Missouri.",
      icon: ChatBubble,
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <section className={`py-16 ${darkMode ? 'bg-secondary-800' : 'bg-white'}`}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${getTextColorClasses('primary', darkMode)}`}>
            AI-Powered Workers Compensation Assistant
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${getTextColorClasses('secondary', darkMode)}`}>
            Our specialized AI solution combines cutting-edge technology with deep legal expertise to transform how attorneys handle workers compensation cases.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl border ${
                darkMode 
                  ? 'bg-secondary-700 border-secondary-600 hover:bg-secondary-600' 
                  : 'bg-white border-neutral-200 hover:bg-neutral-50'
              } transition-colors duration-300`}
            >
              <div className="mb-4">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${getTextColorClasses('primary', darkMode)}`}>
                {feature.title}
              </h3>
              <p className={getTextColorClasses('secondary', darkMode)}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/how-it-works" 
            className="btn btn-accent"
          >
            Learn How It Works
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
