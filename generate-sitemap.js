// Script to generate sitemap.xml for all games
const fs = require('fs');

// Same fallback games list from game.html
const FALLBACK_GAMES = [
  { id:3498, name:'Grand Theft Auto V', released:'2013-09-17', rating:4.47 },
  { id:3328, name:'The Witcher 3: Wild Hunt', released:'2015-05-18', rating:4.66 },
  { id:4200, name:'Portal 2', released:'2011-04-18', rating:4.61 },
  { id:5679, name:'The Elder Scrolls V: Skyrim', released:'2011-11-11', rating:4.42 },
  { id:28, name:'Red Dead Redemption 2', released:'2018-10-26', rating:4.54 },
  { id:409, name:'Cyberpunk 2077', released:'2020-12-10', rating:4.13 },
  { id:58175, name:'God of War', released:'2018-04-20', rating:4.63 },
  { id:422527, name:'Elden Ring', released:'2022-02-25', rating:4.47 },
  { id:326243, name:'Ghost of Tsushima', released:'2020-07-17', rating:4.49 },
  { id:10213, name:'Hollow Knight', released:'2017-02-24', rating:4.41 },
  { id:3439, name:'Hades', released:'2020-09-17', rating:4.46 },
  { id:58134, name:'Sekiro: Shadows Die Twice', released:'2019-03-22', rating:4.5 },
  { id:3070, name:'Fallout 4', released:'2015-11-10', rating:4.07 },
  { id:802, name:'Borderlands 2', released:'2012-09-18', rating:4.24 },
  { id:4062, name:'BioShock Infinite', released:'2013-03-26', rating:4.38 },
  { id:19103, name:'Dishonored', released:'2012-10-09', rating:4.19 },
  { id:12020, name:'Left 4 Dead 2', released:'2009-11-17', rating:4.38 },
  { id:11859, name:'Team Fortress 2', released:'2007-10-10', rating:4.13 },
  { id:278, name:"Assassin's Creed IV: Black Flag", released:'2013-10-29', rating:4.14 },
  { id:4282, name:"Garry's Mod", released:'2006-11-29', rating:4.32 }
];

// Function to create SEO-friendly slug from game name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/--+/g, '-')      // Replace multiple hyphens with single
    .trim();
}

// Generate sitemap XML
function generateSitemap() {
  const baseUrl = 'https://fazzaplay.com'; // Replace with your actual domain
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Game Pages -->
`;

  // Add each game to sitemap
  FALLBACK_GAMES.forEach(game => {
    const slug = createSlug(game.name);
    const lastmod = game.released || currentDate;
    const priority = game.rating >= 4.5 ? '0.9' : game.rating >= 4.0 ? '0.8' : '0.7';
    
    xml += `  <url>
    <loc>${baseUrl}/game/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  });

  xml += `</urlset>`;
  
  // Write sitemap to file
  fs.writeFileSync('sitemap.xml', xml, 'utf8');
  console.log('✅ Sitemap generated successfully: sitemap.xml');
  console.log(`📊 Total URLs: ${FALLBACK_GAMES.length + 3}`);
}

// Run the generator
generateSitemap();
