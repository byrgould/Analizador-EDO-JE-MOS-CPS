const fs = require('fs');
const path = require('path');

// 1. Read EIKOSANY_DATA
const eikosanyPath = path.join(__dirname, 'eikosany-data.ts');
let content = fs.readFileSync(eikosanyPath, 'utf8');
const dataString = content.replace('export const EIKOSANY_DATA = ', '').replace(/;\s*$/, '');
const EIKOSANY_DATA = eval('(' + dataString + ')');

// 2. Read DALESSANDRO_DEGREES from dalessandro.js
const dalesPath = path.join(__dirname, '../../../../tecladosXen/wilson-t41-hex-keyboard-main/hexgrid-workspace/dalessandro.js');
let dalesContent = fs.readFileSync(dalesPath, 'utf8');
const match = dalesContent.match(/export const DALESSANDRO_DEGREES = (\[[\s\S]*?\]);/);
const DALESSANDRO_DEGREES = eval('(' + match[1] + ')');

// 3. Helper to format a note to 3 factors
function padFactors(str) {
    if (str === "∅") return str;
    const parts = str.split(/∙|·/).map(Number).filter(n => !isNaN(n));
    if (parts.length === 3) return parts.sort((a,b)=>a-b).join('·');
    if (parts.length === 2 && !parts.includes(1)) {
        parts.push(1);
        return parts.sort((a,b)=>a-b).join('·');
    }
    return str; // Fallback
}

// 4. Helper to get Real Degree from a padded string
function getRealDegree(paddedStr) {
    const targetFactors = paddedStr.split('·').map(Number).sort((a,b)=>a-b);
    for (const node of DALESSANDRO_DEGREES) {
        if (!node.cpsCategory.includes("Eikosany")) continue;
        
        let r = node.ratio;
        r = r.replace(/3²/g, "9").replace(/∙/g, "·");
        const nodeFactors = r.split('·').map(Number).sort((a,b)=>a-b);
        if (nodeFactors.length === 2 && !nodeFactors.includes(1)) {
            nodeFactors.push(1);
            nodeFactors.sort((a,b)=>a-b);
        }
        
        if (JSON.stringify(targetFactors) === JSON.stringify(nodeFactors)) {
            return node.degree;
        }
    }
    console.error("Could not find real degree for", paddedStr);
    return 999;
}

// 5. Rewrite EIKOSANY_DATA
const NEW_DATA = {};
const keyMap = {
    "Dyads": "Dyanies",
    "Triads": "Trianies",
    "Tetrads": "Tetranies",
    "Hexanies": "Hexanies",
    "Dekanies": "Dekanies"
};

for (const [oldKey, sets] of Object.entries(EIKOSANY_DATA)) {
    const newKey = keyMap[oldKey] || oldKey;
    NEW_DATA[newKey] = sets.map(set => {
        const colonIdx = set.name.indexOf(':');
        const prefix = set.name.substring(0, colonIdx);
        const newPrefix = prefix.replace("Dyad", "Dyany").replace("Triad", "Triany").replace("Tetrad", "Tetrany");
        
        const notesPart = set.name.substring(colonIdx + 1).trim();
        const notes = notesPart.split(',').map(n => n.trim());
        
        const paddedNotes = notes.map(padFactors);
        
        paddedNotes.sort((a, b) => {
            return getRealDegree(a) - getRealDegree(b);
        });
        
        return {
            name: `${newPrefix}: ${paddedNotes.join(', ')}`,
            group: set.group,
            degrees: set.degrees
        };
    });
}

// 6. Write back to file
const newContent = `export const EIKOSANY_DATA = ${JSON.stringify(NEW_DATA, null, 2)};\n`;
fs.writeFileSync(eikosanyPath, newContent, 'utf8');

console.log("Eikosany rewrite successful.");
