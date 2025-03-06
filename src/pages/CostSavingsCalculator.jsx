import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  DollarSign,
  Calculator,
  Clock,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CostSavingsCalculator = () => {
  const [inputs, setInputs] = useState({
    workersCompCases: 50,
    averageHoursPerCase: 25,
    paralegalHourlyRate: 45,
    attorneyHourlyRate: 250,
    percentReductionWithAI: 70
  });

  const [results, setResults] = useState({
    currentAnnualCost: 0,
    aiAssistedAnnualCost: 0,
    potentialSavings: 0,
    paralegalHoursSaved: 0
  });

  // Move calculateSavings to useCallback to avoid infinite loop
  const calculateSavings = useCallback(() => {
    // Calculate current process costs
    const totalHoursPerYear = inputs.workersCompCases * inputs.averageHoursPerCase;
    const currentAnnualCost = totalHoursPerYear * inputs.paralegalHourlyRate;

    // Calculate AI-assisted process costs
    const aiAssistedHours = totalHoursPerYear * (1 - inputs.percentReductionWithAI / 100);
    const aiAssistedAnnualCost = aiAssistedHours * inputs.paralegalHourlyRate;

    // Calculate savings
    const potentialSavings = currentAnnualCost - aiAssistedAnnualCost;
    const paralegalHoursSaved = totalHoursPerYear - aiAssistedHours;

    setResults({
      currentAnnualCost,
      aiAssistedAnnualCost,
      potentialSavings,
      paralegalHoursSaved
    });
  }, [inputs]);

  // Update calculations when inputs change
  useEffect(() => {
    calculateSavings();
  }, [calculateSavings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const costComparisonData = useMemo(() => ([
    {
      name: 'Current Process',
      cost: results.currentAnnualCost,
      hours: inputs.workersCompCases * inputs.averageHoursPerCase
    },
    {
      name: 'With AI Assistant',
      cost: results.aiAssistedAnnualCost,
      hours: inputs.workersCompCases * inputs.averageHoursPerCase * (1 - inputs.percentReductionWithAI / 100)
    }
  ]), [results.currentAnnualCost, results.aiAssistedAnnualCost, inputs]);

  const taskBreakdownData = useMemo(() => ([
    {
      name: 'Document Review',
      traditional: 35,
      withAI: 10
    },
    {
      name: 'Form Completion',
      traditional: 25,
      withAI: 5
    },
    {
      name: 'Research',
      traditional: 20,
      withAI: 8
    },
    {
      name: 'Client Communications',
      traditional: 15,
      withAI: 5
    },
    {
      name: 'Process Management',
      traditional: 5,
      withAI: 2
    }
  ]), []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-neutral-50 dark:bg-secondary-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent-800 to-accent-900 dark:from-accent-800 dark:to-secondary-900 text-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Workers Compensation Cost Savings Calculator
            </h1>
            <p className="text-xl text-accent-100 mb-8">
              See how much your firm or organization could save by implementing our AI Workers Compensation Assistant.
            </p>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-white dark:bg-secondary-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-50 dark:bg-secondary-700 p-6 rounded-xl shadow-md border border-neutral-200 dark:border-secondary-600">
              <h3 className="text-xl font-bold text-secondary-800 dark:text-neutral-200 mb-6 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-accent-600 dark:text-accent-400" />
                Customize Your Calculation
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-neutral-300 mb-2">
                    Number of Workers Comp Cases Per Year
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-4 w-4 text-secondary-400 dark:text-secondary-500" />
                    </div>
                    <input
                      type="number"
                      name="workersCompCases"
                      value={inputs.workersCompCases}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-secondary-600 rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-neutral-100"
                      min="1"
                      max="1000"
                      aria-label="Workers Compensation Cases Per Year"
                    />
                  </div>
                </div>
                
                {/* Rest of input fields remain unchanged but with updated color classes */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-neutral-300 mb-2">
                    Average Paralegal Hours Per Case
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-secondary-400 dark:text-secondary-500" />
                    </div>
                    <input
                      type="number"
                      name="averageHoursPerCase"
                      value={inputs.averageHoursPerCase}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-secondary-600 rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-neutral-100"
                      min="1"
                      max="100"
                      aria-label="Average Paralegal Hours Per Case"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-neutral-300 mb-2">
                    Paralegal Hourly Rate ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-secondary-400 dark:text-secondary-500" />
                    </div>
                    <input
                      type="number"
                      name="paralegalHourlyRate"
                      value={inputs.paralegalHourlyRate}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-secondary-600 rounded-md shadow-sm focus:ring-accent-500 focus:border-accent-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-neutral-100"
                      min="15"
                      max="200"
                      aria-label="Paralegal Hourly Rate"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-neutral-300 mb-2">
                    Estimated Time Reduction with AI (%)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      name="percentReductionWithAI"
                      value={inputs.percentReductionWithAI}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-neutral-200 dark:bg-secondary-600 rounded-lg appearance-none cursor-pointer"
                      min="10"
                      max="90"
                      step="5"
                      aria-label="Estimated Time Reduction With AI"
                    />
                    <span className="ml-3 w-12 text-center text-secondary-700 dark:text-neutral-300 font-medium">
                      {inputs.percentReductionWithAI}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-secondary-500 dark:text-neutral-400 px-1 mt-1">
                    <span>10%</span>
                    <span>50%</span>
                    <span>90%</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-secondary-500 dark:text-neutral-400 italic">
                    Based on observed efficiencies across various legal practices. Your results may vary.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl shadow-md border border-neutral-200 dark:border-secondary-700 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-secondary-700 bg-accent-50 dark:bg-accent-900/20">
                <h3 className="text-xl font-bold text-secondary-800 dark:text-neutral-200 mb-4">Your Potential Savings</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-secondary-700 p-4 rounded-lg shadow-sm border border-accent-100 dark:border-accent-900">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-secondary-500 dark:text-neutral-400">Current Annual Cost</h4>
                      <DollarSign className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-neutral-200">
                      {formatCurrency(results.currentAnnualCost)}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-secondary-700 p-4 rounded-lg shadow-sm border border-accent-100 dark:border-accent-900">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-secondary-500 dark:text-neutral-400">With AI Assistant</h4>
                      <DollarSign className="h-4 w-4 text-accent-500" />
                    </div>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-neutral-200">
                      {formatCurrency(results.aiAssistedAnnualCost)}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-secondary-700 p-4 rounded-lg shadow-sm border border-primary-100 dark:border-primary-900">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-secondary-500 dark:text-neutral-400">Annual Savings</h4>
                      <DollarSign className="h-4 w-4 text-primary-500" />
                    </div>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-500">
                      {formatCurrency(results.potentialSavings)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-accent-600 dark:text-accent-400 mr-2" />
                    <h4 className="text-lg font-semibold text-secondary-800 dark:text-neutral-200">Time Saved</h4>
                  </div>
                  <p className="text-secondary-600 dark:text-neutral-300 mt-1">
                    <span className="font-bold text-accent-700 dark:text-accent-400">{Math.round(results.paralegalHoursSaved)}</span> paralegal hours saved annually
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-lg font-semibold text-secondary-800 dark:text-neutral-200 mb-4">Cost Comparison</h4>
                
                <div className="h-64 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} stroke="#6B7280" />
                      <Tooltip 
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Annual Cost']}
                        contentStyle={{backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: '#4B5563', color: '#F9FAFB'}}
                      />
                      <Legend />
                      <Bar dataKey="cost" name="Annual Cost" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <h4 className="text-lg font-semibold text-secondary-800 dark:text-neutral-200 mb-4">Time Allocation by Task</h4>
                <p className="text-sm text-secondary-600 dark:text-neutral-300 mb-4">
                  Breakdown of hours spent on different workers compensation tasks
                </p>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={taskBreakdownData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="name" type="category" width={100} stroke="#6B7280" />
                      <Tooltip contentStyle={{backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: '#4B5563', color: '#F9FAFB'}} />
                      <Legend />
                      <Bar dataKey="traditional" name="Traditional Process %" fill="#94A3B8" />
                      <Bar dataKey="withAI" name="With AI %" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <div className="bg-accent-50 dark:bg-accent-900/30 rounded-xl p-8 shadow-md border border-accent-100 dark:border-accent-900/50">
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-neutral-200 mb-3">Ready to See Your Actual Savings?</h3>
              <p className="text-lg text-secondary-600 dark:text-neutral-300 mb-6">
                This calculator provides an estimate based on industry averages. Schedule a personalized demo to get an accurate analysis for your specific workflows.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => window.location.href = '/booking-calendar'} 
                  className="px-8 py-3 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg shadow-lg transition duration-200"
                >
                  Book a Demo Call
                </button>
                <button 
                  onClick={() => window.location.href = '/ai-demo'} 
                  className="px-8 py-3 bg-white dark:bg-secondary-700 hover:bg-neutral-100 dark:hover:bg-secondary-600 text-accent-600 dark:text-accent-400 font-medium rounded-lg shadow border border-accent-200 dark:border-accent-800 transition duration-200"
                >
                  Try the AI Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-accent-50 dark:bg-accent-900/30">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-neutral-200 mb-4">
            Ready to Transform Your Workers Comp Practice?
          </h2>
          <p className="text-lg text-secondary-600 dark:text-neutral-300 mb-8">
            Schedule a personalized consultation to see how my expertise and AI solutions can reduce your administrative burden and improve outcomes.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/book"
              className="px-8 py-3 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg shadow-lg transition duration-200 inline-block"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostSavingsCalculator;