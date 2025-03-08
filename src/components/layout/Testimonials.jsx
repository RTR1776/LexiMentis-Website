import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: "LexiMentis has transformed our workers' compensation practice. Medical record analysis that used to take hours now takes minutes, and the jurisdiction-specific guidance is invaluable.",
      author: "Michael Johnson",
      title: "Workers' Compensation Attorney",
      firm: "Johnson & Associates",
      rating: 5,
    },
    {
      id: 2,
      quote: "The AI assistant has become an indispensable part of our firm. The form automation alone has saved us countless hours of administrative work.",
      author: "Sarah Williams",
      title: "Managing Partner",
      firm: "Williams Legal Group",
      rating: 5,
    },
    {
      id: 3,
      quote: "As a solo practitioner, I couldn't afford multiple software solutions. LexiMentis provides everything I need in one platform at a price that makes sense for my practice.",
      author: "David Martinez",
      title: "Attorney at Law",
      firm: "Martinez Law Office",
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="bg-white dark:bg-secondary-800 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-neutral-white mb-4">
            What Attorneys Are Saying
          </h2>
          <p className="text-lg text-secondary-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Hear from workers' compensation attorneys in Kansas and Missouri who have transformed their practice with LexiMentis AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-neutral-50 dark:bg-secondary-700 rounded-xl p-6 shadow-md border border-neutral-200 dark:border-secondary-600"
            >
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <div className="mb-6 relative">
                <Quote className="absolute -top-2 -left-2 h-6 w-6 text-accent-300 dark:text-accent-500 opacity-40" />
                <p className="text-secondary-700 dark:text-neutral-300 relative z-10 pl-4">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div>
                <p className="font-bold text-secondary-900 dark:text-neutral-200">
                  {testimonial.author}
                </p>
                <p className="text-secondary-600 dark:text-neutral-400 text-sm">
                  {testimonial.title}
                </p>
                <p className="text-accent-600 dark:text-accent-400 text-sm">
                  {testimonial.firm}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="/case-studies"
            className="text-accent-800 dark:text-accent-400 font-medium hover:text-accent-700 dark:hover:text-accent-300 transition-colors inline-flex items-center"
          >
            View detailed case studies
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
