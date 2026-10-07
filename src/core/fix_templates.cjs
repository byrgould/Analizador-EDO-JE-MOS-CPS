const fs = require('fs');
const files = [
    'src/core/hexany-data.ts', 'src/core/pentadekany-data.ts'
];
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix Pentanies
    content = content.replace(/name: `Pentany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Pentany " + ($1) + ": (" + $2 + ")"');
    // Fix Tetranies
    content = content.replace(/name: `Tetrany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Tetrany " + ($1) + ": (" + $2 + ")"');
    // Fix Trianies
    content = content.replace(/name: `Triany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Triany " + ($1) + ": (" + $2 + ")"');
    // Fix Dyanies
    content = content.replace(/name: `Dyany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Dyany " + ($1) + ": (" + $2 + ")"');
    // Fix Hexanies
    content = content.replace(/name: `Hexany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Hexany " + ($1) + ": (" + $2 + ")"');
    // Fix Dekanies
    content = content.replace(/name: `Dekany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Dekany " + ($1) + ": (" + $2 + ")"');
    
    // Fix group with template literal: group: `1)2 Dyanies { ${sharedFactor} }`
    content = content.replace(/group: `1\)2 Dyanies \{ \$\{([^}]+)\} \}`/g, 'group: "1)2 Dyanies { " + $1 + " }"');
    
    // Since I replaced the \${ with ${ earlier in pentadekany, let's also support matching un-escaped ${
    content = content.replace(/name: `Pentany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Pentany " + ($1) + ": (" + $2 + ")"');
    content = content.replace(/name: `Tetrany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Tetrany " + ($1) + ": (" + $2 + ")"');
    content = content.replace(/name: `Triany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Triany " + ($1) + ": (" + $2 + ")"');
    content = content.replace(/name: `Dyany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Dyany " + ($1) + ": (" + $2 + ")"');
    content = content.replace(/name: `Hexany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Hexany " + ($1) + ": (" + $2 + ")"');
    content = content.replace(/name: `Dekany \$\{([^}]+)\}: \(\$\{([^}]+)\}\)`/g, 'name: "Dekany " + ($1) + ": (" + $2 + ")"');
    content = content.replace(/group: `1\)2 Dyanies \{ \$\{([^}]+)\} \}`/g, 'group: "1)2 Dyanies { " + $1 + " }"');

    fs.writeFileSync(file, content);
}
