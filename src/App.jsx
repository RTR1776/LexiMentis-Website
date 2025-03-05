import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/layout/Layout';
import LexiMentisLanding from './components/landing/leximentis-landing';
import HowItWorksPage from './pages/HowItWorks';
import DemoPage from './pages/AIDemo';
import BookingPage from './pages/BookingCalendar';
import CalculatorPage from './pages/CostSavingsCalculator';
import AboutPage from './pages/AboutPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LexiMentisLanding />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route path="demo" element={<DemoPage />} />
              <Route path="book" element={<BookingPage />} />
              <Route path="calculator" element={<CalculatorPage />} />
              <Route path="about" element={<AboutPage />} />
            </Route>
          </Routes>
          <Analytics />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
