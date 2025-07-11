const fs = require('fs');
const path = require('path');

const baseUrl = 'https://yourdomain.com'; // Replace with your actual domain
const dist = path.join(__dirname, 'dist');

// 1. Create sitemap.xml
function generateSitemap() {
  const htmlFiles = fs.readdirSync(dist).filter(f => f.endsWith('.html'));
  const urls = htmlFiles.map(file =>
    `${baseUrl}/${file === 'index.html' ? '' : file}`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml, 'utf8');
  console.log('✅ sitemap.xml created');
}

// 2. Create robots.txt
function generateRobots() {
  const content = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;
  fs.writeFileSync(path.join(dist, 'robots.txt'), content, 'utf8');
  console.log('✅ robots.txt created');
}

// 3. Add meta tags to dist/index.html if missing
function updateMetaTags() {
  const indexPath = path.join(dist, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  if (!html.includes('<title>')) {
    html = html.replace('<head>', '<head>\n  <title>Your Site Title</title>');
  }

  if (!html.includes('name="description"')) {
    html = html.replace('<head>', '<head>\n  <meta name="description" content="Your site description here.">');
  }

  if (!html.includes('name="viewport"')) {
    html = html.replace('<head>', '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1">');
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✅ index.html updated with SEO meta tags');
}

// Run all steps
generateSitemap();
generateRobots();
updateMetaTags();
