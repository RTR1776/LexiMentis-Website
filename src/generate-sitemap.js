// filepath: c:\Projects\LexiMentisWebsite\generate-sitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

// List your URLs
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  // ...add additional URLs
];

async function generateSitemap() {
  const sitemapStream = new SitemapStream({ hostname: 'https://www.yoursite.com' });
  const writeStream = createWriteStream('sitemap.xml');
  
  sitemapStream.pipe(writeStream);
  links.forEach(link => sitemapStream.write(link));
  sitemapStream.end();

  await streamToPromise(sitemapStream);
  console.log('Sitemap generated!');
}

generateSitemap().catch(console.error);