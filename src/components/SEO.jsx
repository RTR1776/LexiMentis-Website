import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title = 'AI Workers\' Compensation Assistant', 
  description = 'AI-powered workers\' compensation assistant for attorneys in Kansas and Missouri',
  keywords = 'workers compensation, legal AI, Kansas workers comp, Missouri workers comp',
  canonical,
  image = '/og-image.jpg',
  schema
}) => {
  const siteUrl = 'https://www.leximentis.com';
  const pageUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const imageUrl = `${siteUrl}${image}`;
  
  return (
    <Helmet>
      <title>{`LexiMentis - ${title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={`LexiMentis - ${title}`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={`LexiMentis - ${title}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
