const fs = require('fs');
const file = 'k:\\Distributed Job Queue\\1-client\\src\\app\\pages\\docs\\docs.component.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\\`/g, '`');
fs.writeFileSync(file, content);
console.log('Done!');
