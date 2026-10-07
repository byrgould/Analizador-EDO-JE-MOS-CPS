const fs = require('fs');
const path = require('path');

const monanyPath = path.join(__dirname, 'monany-data.ts');

const newContent = `export interface MonanySubset {
    name: string;
    group: string;
    degrees: number[];
}

function generate0_6_Monany() {
    const monanies: MonanySubset[] = [];

    // The 0)6 Monany contains a single empty set
    monanies.push({
        group: "0)6 Monany",
        name: \`Monany 1: ∅\`,
        degrees: [0] // Real degree 0 maps to ∅
    });

    return { "Monanies": monanies };
}

function generate6_6_Monany() {
    const monanies: MonanySubset[] = [];

    // The 6)6 Monany contains a single set with all 6 factors
    monanies.push({
        group: "6)6 Monany",
        name: \`Monany 1: 1·3·5·7·9·11\`,
        degrees: [41] // Real degree 41 maps to the full set
    });

    return { "Monanies": monanies };
}

export const MONANY_0_6 = generate0_6_Monany();
export const MONANY_6_6 = generate6_6_Monany();
`;

fs.writeFileSync(monanyPath, newContent, 'utf8');
console.log("Monany updated.");
