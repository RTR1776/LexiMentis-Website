import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './components/landing/leximentis-landing';
import HowItWorksPage from './pages/HowItWorks';
import DemoPage from './pages/AIDemo';
import BookingPage from './pages/BookingCalendar';
import CalculatorPage from './pages/CostSavingsCalculator';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="demo" element={<DemoPage />} />
        <Route path="book" element={<BookingPage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
