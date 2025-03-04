import React from 'react';
import { Routes, Route } from 'react-router-dom';
// ...existing code...
import LexiMentisLanding from '../components/landing/leximentis-landing';
// ...existing code...

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LexiMentisLanding />} />
      {/* ...existing code... */}
    </Routes>
  );
};

export default AppRoutes;
