import React from 'react';
import SEO from '../components/common/SEO';
import Hero from '../components/layout/Hero';
import Features from '../components/layout/Features';
import Testimonials from '../components/layout/Testimonials';
import CallToAction from '../components/layout/CallToAction';

const HomePage = () => {
  // Rich structured data for homepage
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LexiMentis",
    "url": "https://www.leximentis.com",
    "description": "AI-powered workers' compensation assistant for attorneys in Kansas and Missouri",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.leximentis.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "LexiMentis",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.leximentis.com/LexiMentis-Logo.svg"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "highPrice": "1000",
      "offerCount": "3"
    }
  };

  return (
    <>
      <SEO 
        title="AI Workers' Compensation Assistant for Attorneys" 
        description="LexiMentis is an AI-powered legal assistant that streamlines workers' compensation cases for attorneys in Kansas and Missouri. Reduce costs and improve outcomes with AI technology."
        keywords="workers compensation AI, legal AI assistant, Kansas workers comp, Missouri workers comp, legal document analysis, workers comp forms"
        canonical="/"
        schema={schema}
      />
      
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default HomePage;
