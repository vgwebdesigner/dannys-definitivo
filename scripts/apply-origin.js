/**
 * Aggiorna il dominio in tutto il sito.
 * 1. Scrivi l’URL senza slash finale in SITE_ORIGIN.txt
 * 2. node scripts/apply-origin.js
 *
 * Sostituisce canonical, hreflang, og:url, og:image, twitter:image,
 * JSON-LD e sitemap/robots.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let NEW = fs.readFileSync(path.join(root, 'SITE_ORIGIN.txt'), 'utf8')
  .split(/\r?\n/).map(l => l.trim()).find(l => /^https?:\/\//.test(l));
if (NEW) NEW = NEW.replace(/\/$/, '');
if (!NEW || !/^https?:\/\//.test(NEW)) {
  console.error('SITE_ORIGIN.txt deve contenere un URL assoluto, es. https://www.esempio.it');
  process.exit(1);
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const loc = sitemap.match(/<loc>(https?:\/\/[^/<]+(?:\/[^<]*?)?)\/?(?:index\.html)?<\/loc>/);
let OLD = loc ? loc[1].replace(/\/index\.html$/, '').replace(/\/$/, '') : '';
if (!OLD || OLD === NEW) {
  const any = sitemap.match(/https:\/\/vgwebdesigner\.github\.io\/dannys-definitivo/);
  if (any) OLD = 'https://vgwebdesigner.github.io/dannys-definitivo';
}
if (!OLD) OLD = 'https://vgwebdesigner.github.io/dannys-definitivo';

const exts = new Set(['.html', '.xml', '.txt', '.js', '.webmanifest']);
const skip = new Set(['apply-origin.js']);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === 'fonts') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (exts.has(path.extname(name)) && !skip.has(name)) out.push(p);
  }
  return out;
}

let n = 0;
for (const file of walk(root)) {
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes(OLD) && !s.includes('__SITE_ORIGIN__')) continue;
  const next = s.split(OLD).join(NEW).split('__SITE_ORIGIN__').join(NEW);
  if (next !== s) {
    fs.writeFileSync(file, next);
    n++;
    console.log('updated', path.relative(root, file));
  }
}
console.log(n ? `Origine: ${OLD} → ${NEW}` : `Nessun cambiamento (già ${NEW})`);
