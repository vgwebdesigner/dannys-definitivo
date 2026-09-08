const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'fonts');
const css = fs.readFileSync(path.join(dir, '_source.css'), 'utf8');
const map = JSON.parse(fs.readFileSync(path.join(dir, '_map.json'), 'utf8'));
let out = css;
for (const { url, name } of map) {
  out = out.split(url).join(`fonts/${name}`);
}
fs.writeFileSync(path.join(__dirname, '..', 'fonts.css'), out);
console.log('fonts.css written');
