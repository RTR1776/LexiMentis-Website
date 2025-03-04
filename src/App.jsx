import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import LexiMentisLanding from './components/landing/leximentis-landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LexiMentisLanding />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
