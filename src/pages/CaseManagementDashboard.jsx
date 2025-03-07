import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Calendar, 
  Clock,
  CheckCircle,
  Calculator
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const CaseManagementPage = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { darkMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [injuryFilter, setInjuryFilter] = useState('');
  
  // Case data
  const allCases = [
    {
      id: "WC-2025-1001",
      client: "John Smith",
      status: "Discovery",
      injuryType: "Back Injury",
      dueDate: "03/15/2025",
      statusColor: "accent"
    },
    {
      id: "WC-2025-1002",
      client: "Sarah Johnson",
      status: "Hearing Preparation",
      injuryType: "Carpal Tunnel",
      dueDate: "03/10/2025",
      statusColor: "orange"
    },
    {
      id: "WC-2025-1003",
      client: "Michael Brown",
      status: "Settlement",
      injuryType: "Knee Injury",
      dueDate: "04/05/2025",
      statusColor: "green"
    },
    {
      id: "WC-2025-1004",
      client: "Emily Wilson",
      status: "Intake",
      injuryType: "Shoulder Injury",
      dueDate: "03/18/2025",
      statusColor: "blue"
    },
    {
      id: "WC-2025-1005",
      client: "Robert Davis",
      status: "Discovery",
      injuryType: "Back Injury",
      dueDate: "03/22/2025",
      statusColor: "accent"
    },
    {
      id: "WC-2025-1006",
      client: "Jennifer Garcia",
      status: "Negotiation",
      injuryType: "Repetitive Strain",
      dueDate: "04/02/2025",
      statusColor: "purple"
    },
    {
      id: "WC-2025-1007",
      client: "Thomas Martinez",
      status: "Hearing Preparation",
      injuryType: "Head Injury",
      dueDate: "03/25/2025",
      statusColor: "orange"
    },
    {
      id: "WC-2025-1008",
      client: "Lisa Robinson",
      status: "Settlement",
      injuryType: "Back Injury",
      dueDate: "04/10/2025",
      statusColor: "green"
    },
    {
      id: "WC-2025-1009",
      client: "David Thompson",
      status: "Intake",
      injuryType: "Knee Injury",
      dueDate: "03/12/2025",
      statusColor: "blue"
    },
    {
      id: "WC-2025-1010",
      client: "Amanda Lee",
      status: "Negotiation",
      injuryType: "Wrist Injury",
      dueDate: "03/30/2025",
      statusColor: "purple"
    }
  ];

  // Filter cases based on search term and filters
  const filteredCases = allCases.filter(caseItem => {
    const matchesSearch = searchTerm === '' || 
                        caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        caseItem.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || caseItem.status === statusFilter;
    
    const matchesInjury = injuryFilter === '' || caseItem.injuryType === injuryFilter;
    
    return matchesSearch && matchesStatus && matchesInjury;
  });
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Navigation Component
  const Navigation = () => {
    return (
      <div className={`w-64 ${darkMode ? 'bg-secondary-800' : 'bg-white border-r border-neutral-200'} text-${darkMode ? 'white' : 'secondary-900'} h-screen fixed left-0 top-0 pt-20 px-4 pb-6`}>
        <ul>
          <li className={`mb-2 p-2 rounded ${activeView === 'dashboard' ? darkMode ? 'bg-accent-700' : 'bg-accent-50 text-accent-800' : darkMode ? 'hover:bg-secondary-700' : 'hover:bg-neutral-100'}`}>
            <button className="w-full text-left" onClick={() => setActiveView('dashboard')}>Dashboard</button>
          </li>
          <li className={`mb-2 p-2 rounded ${activeView === 'cases' ? darkMode ? 'bg-accent-700' : 'bg-accent-50 text-accent-800' : darkMode ? 'hover:bg-secondary-700' : 'hover:bg-neutral-100'}`}>
            <button className="w-full text-left" onClick={() => setActiveView('cases')}>Cases</button>
          </li>
          <li className={`mb-2 p-2 rounded ${activeView === 'clients' ? darkMode ? 'bg-accent-700' : 'bg-accent-50 text-accent-800' : darkMode ? 'hover:bg-secondary-700' : 'hover:bg-neutral-100'}`}>
            <button className="w-full text-left" onClick={() => setActiveView('clients')}>Clients</button>
          </li>
          <li className={`mb-2 p-2 rounded ${activeView === 'documents' ? darkMode ? 'bg-accent-700' : 'bg-accent-50 text-accent-800' : darkMode ? 'hover:bg-secondary-700' : 'hover:bg-neutral-100'}`}>
            <button className="w-full text-left" onClick={() => setActiveView('documents')}>Documents</button>
          </li>
          <li className={`mb-2 p-2 rounded ${activeView === 'calendar' ? darkMode ? 'bg-accent-700' : 'bg-accent-50 text-accent-800' : darkMode ? 'hover:bg-secondary-700' : 'hover:bg-neutral-100'}`}>
            <button className="w-full text-left" onClick={() => setActiveView('calendar')}>Calendar</button>
          </li>
          <li className={`mb-2 p-2 rounded ${activeView === 'tasks' ? darkMode ? 'bg-accent-700' : 'bg-accent-50 text-accent-800' : darkMode ? 'hover:bg-secondary-700' : 'hover:bg-neutral-100'}`}>
            <button className="w-full text-left" onClick={() => setActiveView('tasks')}>Tasks</button>
          </li>
          <li className={`mb-2 p-2 rounded ${activeView === 'reports' ? darkMode ? 'bg-accent-700' : 'bg-accent-50 text-accent-800' : darkMode ? 'hover:bg-secondary-700' : 'hover:bg-neutral-100'}`}>
            <button className="w-full text-left" onClick={() => setActiveView('reports')}>Reports</button>
          </li>
          <li className={`mt-8 mb-2 p-2 rounded ${activeView === 'ai' ? darkMode ? 'bg-primary-700' : 'bg-primary-50 text-primary-800' : darkMode ? 'hover:bg-secondary-700' : 'hover:bg-neutral-100'}`}>
            <button className="w-full text-left flex items-center" onClick={() => setActiveView('ai')}>
              <span className={`inline-block w-2 h-2 rounded-full ${darkMode ? 'bg-primary-400' : 'bg-primary-500'} mr-2`}></span>
              AI Assistant
            </button>
          </li>
        </ul>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    return (
      <div>
        <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`${darkMode ? 'bg-accent-900/30' : 'bg-accent-50'} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-accent-400' : 'text-accent-800'} mb-1`}>Active Cases</h3>
            <p className={`text-3xl font-bold ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>23</p>
          </div>
          <div className={`${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-800'} mb-1`}>Pending Tasks</h3>
            <p className={`text-3xl font-bold ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>14</p>
          </div>
          <div className={`${darkMode ? 'bg-green-900/30' : 'bg-green-50'} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-green-800'} mb-1`}>Recent Settlements</h3>
            <p className={`text-3xl font-bold ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>5</p>
          </div>
          <div className={`${darkMode ? 'bg-primary-900/30' : 'bg-primary-50'} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-primary-400' : 'text-primary-800'} mb-1`}>Upcoming Hearings</h3>
            <p className={`text-3xl font-bold ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>3</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Upcoming Tasks</h2>
            <div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>File response to discovery</p>
                <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>Due: 03/10/2025 • High Priority</p>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Request medical records</p>
                <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>Due: 03/05/2025 • Medium Priority</p>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Schedule IME appointment</p>
                <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>Due: 03/15/2025 • Medium Priority</p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Recent Documents</h2>
            <div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <FileText className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Medical Records - Dr. Johnson</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>Added: 02/15/2025 • Medical Record</p>
                  </div>
                </div>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <FileText className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Deposition Transcript - John Smith</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>Added: 02/22/2025 • Deposition</p>
                  </div>
                </div>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <FileText className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Settlement Proposal - Draft</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>Added: 03/01/2025 • Settlement Document</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Upcoming Events</h2>
            <div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Status Conference</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>03/10/2025, 9:00 AM • Division of Workers Comp</p>
                  </div>
                </div>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Client Meeting</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>03/05/2025, 2:00 PM • Office</p>
                  </div>
                </div>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Dr. Phillips Deposition</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>03/15/2025, 1:00 PM • Dr. Phillips Office</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Case Status Distribution</h2>
            <div className="h-64 flex items-center justify-center">
              <div className={`text-${darkMode ? 'neutral-400' : 'secondary-400'} italic`}>
                [Placeholder for Status Distribution Chart]
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Cases List Component
  const CasesList = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Cases</h1>
          <button className={`${darkMode ? 'bg-primary-600 hover:bg-primary-700' : 'bg-primary-500 hover:bg-primary-600'} text-white py-2 px-4 rounded flex items-center`}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Case
          </button>
        </div>
        
        <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} rounded-lg shadow mb-6`}>
          <div className={`p-4 border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'}`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <div className={`relative flex items-center ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>
                  <Search className="h-4 w-4 absolute left-3" />
                  <input 
                    type="text" 
                    placeholder="Search cases..." 
                    className={`w-full p-2 pl-10 border rounded ${darkMode ? 'bg-secondary-700 border-secondary-600 text-neutral-200 placeholder-neutral-400' : 'bg-white border-neutral-300 text-secondary-800'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/4">
                <select 
                  className={`w-full p-2 border rounded ${darkMode ? 'bg-secondary-700 border-secondary-600 text-neutral-200' : 'bg-white border-neutral-300 text-secondary-800'}`}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Intake">Intake</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Hearing Preparation">Hearing Preparation</option>
                  <option value="Settlement">Settlement</option>
                </select>
              </div>
              <div className="w-full md:w-1/4">
                <select 
                  className={`w-full p-2 border rounded ${darkMode ? 'bg-secondary-700 border-secondary-600 text-neutral-200' : 'bg-white border-neutral-300 text-secondary-800'}`}
                  value={injuryFilter}
                  onChange={(e) => setInjuryFilter(e.target.value)}
                >
                  <option value="">All Injury Types</option>
                  <option value="Back Injury">Back Injury</option>
                  <option value="Shoulder Injury">Shoulder Injury</option>
                  <option value="Knee Injury">Knee Injury</option>
                  <option value="Wrist Injury">Wrist Injury</option>
                  <option value="Carpal Tunnel">Carpal Tunnel</option>
                  <option value="Head Injury">Head Injury</option>
                  <option value="Repetitive Strain">Repetitive Strain</option>
                </select>
              </div>
              <div className="w-full md:w-1/6">
                <button 
                  className={`w-full h-full p-2 flex items-center justify-center rounded border ${darkMode ? 'border-secondary-600 text-neutral-300 hover:bg-secondary-700' : 'border-neutral-300 text-secondary-700 hover:bg-neutral-100'}`}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setInjuryFilter('');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={`${darkMode ? 'bg-secondary-700' : 'bg-neutral-100'}`}>
                <tr>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>Case Number</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>Client</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>Status</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>Injury Type</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>Next Due Date</th>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className={`border-b ${darkMode ? 'border-secondary-700 hover:bg-secondary-700/50' : 'hover:bg-neutral-50 border-neutral-200'}`}>
                    <td className={`py-3 px-4 font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>{caseItem.id}</td>
                    <td className={`py-3 px-4 ${darkMode ? 'text-neutral-300' : 'text-secondary-800'}`}>{caseItem.client}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        getStatusColorClass(caseItem.statusColor, darkMode)
                      }`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 ${darkMode ? 'text-neutral-300' : 'text-secondary-800'}`}>{caseItem.injuryType}</td>
                    <td className={`py-3 px-4 ${darkMode ? 'text-neutral-300' : 'text-secondary-800'}`}>{caseItem.dueDate}</td>
                    <td className="py-3 px-4">
                      <button className={`${darkMode ? 'text-accent-400 hover:text-accent-300' : 'text-accent-600 hover:text-accent-800'} mr-3`}>
                        View
                      </button>
                      <button className={`${darkMode ? 'text-neutral-400 hover:text-neutral-300' : 'text-secondary-600 hover:text-secondary-800'}`}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className={`p-4 border-t ${darkMode ? 'border-secondary-700' : 'border-neutral-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-700'}`}>
                  Showing {filteredCases.length > 0 ? 1 : 0} to {filteredCases.length} of {filteredCases.length} results
                </span>
              </div>
              <div className="flex gap-2">
                <button className={`px-3 py-1 border rounded ${darkMode ? 'border-secondary-600 text-neutral-300 bg-secondary-700' : 'border-neutral-300 text-secondary-700 bg-neutral-100'}`}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className={`px-3 py-1 border rounded ${darkMode ? 'bg-primary-600 text-white border-primary-700' : 'bg-primary-500 text-white border-primary-600'}`}>1</button>
                <button className={`px-3 py-1 border rounded ${darkMode ? 'border-secondary-600 text-neutral-300 hover:bg-secondary-700' : 'border-neutral-300 text-secondary-700 hover:bg-neutral-100'}`}>2</button>
                <button className={`px-3 py-1 border rounded ${darkMode ? 'border-secondary-600 text-neutral-300 hover:bg-secondary-700' : 'border-neutral-300 text-secondary-700 hover:bg-neutral-100'}`}>3</button>
                <button className={`px-3 py-1 border rounded ${darkMode ? 'border-secondary-600 text-neutral-300 hover:bg-secondary-700' : 'border-neutral-300 text-secondary-700 hover:bg-neutral-100'}`}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper function for status color classes
  const getStatusColorClass = (color, isDarkMode) => {
    const colorMap = {
      accent: isDarkMode ? 'bg-accent-900/30 text-accent-300' : 'bg-accent-100 text-accent-800',
      orange: isDarkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800',
      green: isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800',
      blue: isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800',
      purple: isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800',
    };
    return colorMap[color] || (isDarkMode ? 'bg-neutral-900/30 text-neutral-300' : 'bg-neutral-100 text-neutral-800');
  };

  // AI Assistant Component
  const AIAssistant = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>AI Legal Assistant</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} rounded-lg shadow p-4 mb-4 h-96 overflow-y-auto`}>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className={`${darkMode ? 'bg-primary-900/30 text-primary-300' : 'bg-primary-100 text-primary-800'} rounded-full p-2 mr-3`}>
                    <span>AI</span>
                  </div>
                  <div className={`${darkMode ? 'bg-secondary-700' : 'bg-neutral-100'} rounded-lg p-3 max-w-3xl`}>
                    <p className={darkMode ? 'text-neutral-200' : 'text-secondary-800'}>
                      <span className="font-medium mb-1 block">Medical Records Summary for John Smith (WC-2025-1001)</span>
                      I've analyzed 7 medical records from 3 providers spanning Nov 2024 to Feb 2025. Here are the key findings:
                    </p>
                    
                    <p className={`font-medium mt-3 mb-1 ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Diagnosis:</p>
                    <ul className={`list-disc pl-5 mb-2 ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>
                      <li>L4/L5 disc herniation with right-sided nerve root compression</li>
                      <li>Lumbar radiculopathy affecting right leg</li>
                      <li>Chronic lower back pain</li>
                    </ul>
                    
                    <p className={`font-medium mt-3 mb-1 ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Treatment History:</p>
                    <ul className={`list-disc pl-5 mb-2 ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>
                      <li>Initial conservative care: rest, medication</li>
                      <li>Physical therapy: 12 sessions completed with minimal improvement</li>
                      <li>Interventional pain management: 2 epidural steroid injections</li>
                    </ul>
                    
                    <p className={`font-medium mt-3 mb-1 ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Work Status:</p>
                    <ul className={`list-disc pl-5 mb-2 ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>
                      <li>Currently on temporary total disability</li>
                      <li>No lifting over 10 pounds</li>
                      <li>No repetitive bending or twisting</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start justify-end">
                  <div className={`${darkMode ? 'bg-accent-700' : 'bg-accent-600'} text-white rounded-lg p-3 max-w-3xl`}>
                    <p>Can you summarize the medical records for John Smith's case?</p>
                  </div>
                  <div className={`${darkMode ? 'bg-neutral-600' : 'bg-neutral-300'} rounded-full p-2 ml-3`}>
                    <span className={darkMode ? 'text-neutral-200' : 'text-secondary-700'}>You</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`${darkMode ? 'bg-primary-900/30 text-primary-300' : 'bg-primary-100 text-primary-800'} rounded-full p-2 mr-3`}>
                    <span>AI</span>
                  </div>
                  <div className={`${darkMode ? 'bg-secondary-700' : 'bg-neutral-100'} rounded-lg p-3 max-w-3xl`}>
                    <p className={darkMode ? 'text-neutral-200' : 'text-secondary-800'}>Hello! I'm your LexiMentis AI Assistant. How can I help you with your workers' compensation cases today?</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} rounded-lg shadow p-4`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Select Case Context</h2>
              <select className={`w-full p-2 border rounded mb-4 ${darkMode ? 'bg-secondary-700 border-secondary-600 text-neutral-200' : 'bg-white border-neutral-300 text-secondary-800'}`}>
                <option value="1">WC-2025-1001 - John Smith</option>
                <option value="2">WC-2025-1002 - Sarah Johnson</option>
                <option value="3">WC-2025-1003 - Michael Brown</option>
              </select>
              
              <h3 className={`font-medium mb-2 ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Active Case Documents</h3>
              <div className="mb-4 space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="doc1" className="mr-2" defaultChecked />
                  <label htmlFor="doc1" className={`text-sm ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>Medical Records - Dr. Johnson</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="doc2" className="mr-2" defaultChecked />
                  <label htmlFor="doc2" className={`text-sm ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>Deposition Transcript - John Smith</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="doc3" className="mr-2" defaultChecked />
                  <label htmlFor="doc3" className={`text-sm ${darkMode ? 'text-neutral-300' : 'text-secondary-700'}`}>MRI Report - KC Medical Center</label>
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} rounded-lg shadow p-4`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Quick Actions</h2>
              <div className="space-y-2">
                <button className={`w-full text-left p-2 border rounded ${darkMode ? 'border-secondary-600 text-neutral-200 hover:bg-secondary-700' : 'border-neutral-300 text-secondary-700 hover:bg-neutral-50'} mb-2 flex items-center`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Summarize medical records
                </button>
                <button className={`w-full text-left p-2 border rounded ${darkMode ? 'border-secondary-600 text-neutral-200 hover:bg-secondary-700' : 'border-neutral-300 text-secondary-700 hover:bg-neutral-50'} mb-2 flex items-center`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Draft settlement demand letter
                </button>
                <button className={`w-full text-left p-2 border rounded ${darkMode ? 'border-secondary-600 text-neutral-200 hover:bg-secondary-700' : 'border-neutral-300 text-secondary-700 hover:bg-neutral-50'} mb-2 flex items-center`}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate potential benefits
                </button>
                <button className={`w-full text-left p-2 border rounded ${darkMode ? 'border-secondary-600 text-neutral-200 hover:bg-secondary-700' : 'border-neutral-300 text-secondary-700 hover:bg-neutral-50'} mb-2 flex items-center`}>
                  <Search className="h-4 w-4 mr-2" />
                  Find relevant case precedents
                </button>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Recent Documents</h2>
            <div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <FileText className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Medical Records - Dr. Johnson</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>Added: 02/15/2025 • Medical Record</p>
                  </div>
                </div>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <FileText className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Deposition Transcript - John Smith</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>Added: 02/22/2025 • Deposition</p>
                  </div>
                </div>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <FileText className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Settlement Proposal - Draft</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>Added: 03/01/2025 • Settlement Document</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Upcoming Events</h2>
            <div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Status Conference</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>03/10/2025, 9:00 AM • Division of Workers Comp</p>
                  </div>
                </div>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Client Meeting</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>03/05/2025, 2:00 PM • Office</p>
                  </div>
                </div>
              </div>
              <div className={`border-b ${darkMode ? 'border-secondary-700' : 'border-neutral-200'} py-2`}>
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 mr-2 ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-neutral-200' : 'text-secondary-800'}`}>Dr. Phillips Deposition</p>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>03/15/2025, 1:00 PM • Dr. Phillips Office</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-secondary-800' : 'bg-white'} p-4 rounded-lg shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-neutral-100' : 'text-secondary-900'}`}>Case Status Distribution</h2>
            <div className="h-64 flex items-center justify-center">
              <div className={`text-${darkMode ? 'neutral-400' : 'secondary-400'} italic`}>
                [Placeholder for Status Distribution Chart]
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the appropriate view based on activeView state
  const renderContent = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'cases':
        return <CasesList />;
      case 'ai':
        return <AIAssistant />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className={`text-lg ${darkMode ? 'text-neutral-400' : 'text-secondary-500'}`}>
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)} view will be implemented in a future phase.
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Header scrolled={scrolled} />
      <div className={`${darkMode ? 'bg-secondary-900' : 'bg-neutral-50'} min-h-screen pt-16 flex-grow`}>
        <Navigation />
        <div className="ml-64 p-6">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CaseManagementPage;