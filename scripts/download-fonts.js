const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '..', 'fonts');
fs.mkdirSync(dir, { recursive: true });

const cssUrl = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Montserrat:wght@300;400;500;600&display=swap';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  const css = (await get(cssUrl)).toString('utf8');
  const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m => m[1]);
  const unique = [...new Set(urls)];
  let i = 0;
  const map = [];
  for (const u of unique) {
    i += 1;
    const name = `gf-${i}.woff2`;
    fs.writeFileSync(path.join(dir, name), await get(u));
    map.push({ url: u, name });
    console.log('saved', name);
  }
  fs.writeFileSync(path.join(dir, '_source.css'), css);
  fs.writeFileSync(path.join(dir, '_map.json'), JSON.stringify(map, null, 2));
})();
