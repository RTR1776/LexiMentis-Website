import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import HowItWorks from './pages/HowItWorks';
import AIDemo from './pages/AIDemo';
import CaseManagementDashboard from './pages/CaseManagementDashboard';
// ...other imports...

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/demo" element={<AIDemo />} />
            <Route path="/case-management" element={<CaseManagementDashboard />} />
            {/* ...other routes... */}
          </Routes>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
