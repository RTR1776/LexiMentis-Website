import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="bg-accent-50 dark:bg-accent-900/30 py-16">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-neutral-white mb-4">
          Ready to Transform Your Workers Comp Practice?
        </h2>
        <p className="text-lg text-secondary-600 dark:text-neutral-300 mb-8">
          Schedule a personalized consultation to see how our AI solutions can reduce your administrative burden and improve outcomes.
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
    </section>
  );
};

export default CallToAction;