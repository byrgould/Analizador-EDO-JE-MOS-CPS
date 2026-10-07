const fs = require('fs');

// Fix Eikosany
let eiko = fs.readFileSync('/Users/byron/Documents/analizadorEDO/web/src/core/eikosany-data.ts', 'utf8');
eiko = eiko.replace(/"name": "([^:]+): ([^"]+)"/g, '"name": "$1: ($2)"');
fs.writeFileSync('/Users/byron/Documents/analizadorEDO/web/src/core/eikosany-data.ts', eiko);

// Fix Monany
let mona = fs.readFileSync('/Users/byron/Documents/analizadorEDO/web/src/core/monany-data.ts', 'utf8');
mona = mona.replace(/name: `Monany 1: ∅`/g, 'name: "Monany 1: (∅)"');
mona = mona.replace(/name: `Monany 1: 1·3·5·7·9·11`/g, 'name: "Monany 1: (1·3·5·7·9·11)"');
fs.writeFileSync('/Users/byron/Documents/analizadorEDO/web/src/core/monany-data.ts', mona);
