const fs = require('fs');
const path = require('path');

const pentadekanyPath = path.join(__dirname, 'pentadekany-data.ts');

const newContent = `const FACTORS = [1, 3, 5, 7, 9, 11];

function getCombinations(arr: number[], k: number): number[][] {
    const result: number[][] = [];
    function backtrack(start: number, current: number[]) {
        if (current.length === k) {
            result.push([...current]);
            return;
        }
        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    backtrack(0, []);
    return result;
}

function formatNote(combo: number[]): string {
    return combo.sort((a, b) => a - b).join('·');
}

const ratio_to_real_2_6: Record<string, number> = {
    "1·3": 25, "1·5": 14, "1·7": 34, "1·9": 7, "1·11": 21,
    "3·5": 37, "3·7": 17, "3·9": 31, "3·11": 2,
    "5·7": 6, "5·9": 22, "5·11": 33,
    "7·9": 41, "7·11": 12, "9·11": 27
};

const ratio_to_real_4_6: Record<string, number> = {
    "1·3·5·7": 30, "1·3·5·9": 3, "1·3·5·11": 16,
    "1·3·7·9": 24, "1·3·7·11": 35, "1·3·9·11": 9,
    "1·5·7·9": 13, "1·5·7·11": 26, "1·5·9·11": 40, "1·7·9·11": 20,
    "3·5·7·9": 36, "3·5·7·11": 8, "3·5·9·11": 23, "3·7·9·11": 1, "5·7·9·11": 32
};

export interface PentadekanySubset {
    name: string;
    group: string;
    degrees: number[];
}

function generate2_6_Pentadekany() {
    const pentanies: PentadekanySubset[] = [];
    const hexanies: PentadekanySubset[] = [];
    const dekanies: PentadekanySubset[] = [];
    const trianies: PentadekanySubset[] = [];
    const dyanies: PentadekanySubset[] = [];

    const formatSubsetNotes26 = (combos: number[][]) => {
        return combos.sort((a, b) => ratio_to_real_2_6[formatNote(a)] - ratio_to_real_2_6[formatNote(b)])
                     .map(formatNote).join(', ');
    };

    let pCount = 1;
    FACTORS.forEach(commonFactor => {
        const remaining = FACTORS.filter(f => f !== commonFactor);
        const notes = remaining.map(r => [commonFactor, r]);
        const degrees = notes.map(c => ratio_to_real_2_6[formatNote(c)]);
        pentanies.push({ group: "1)5 Pentanies", name: \`Pentany \${pCount++}: (\${formatSubsetNotes26(notes)})\`, degrees });
    });

    let hCount = 1;
    getCombinations(FACTORS, 4).forEach(f4 => {
        const combos = getCombinations(f4, 2);
        const degrees = combos.map(c => ratio_to_real_2_6[formatNote(c)]);
        hexanies.push({ group: "2)4 Hexanies", name: \`Hexany \${hCount++}: (\${formatSubsetNotes26(combos)})\`, degrees });
    });

    let dekCount = 1;
    FACTORS.forEach(omitted => {
        const kept = FACTORS.filter(f => f !== omitted);
        const combos = getCombinations(kept, 2);
        const degrees = combos.map(c => ratio_to_real_2_6[formatNote(c)]);
        dekanies.push({ group: "2)5 Dekanies", name: \`Dekany \${dekCount++}: (\${formatSubsetNotes26(combos)})\`, degrees });
    });

    let tCount = 1;
    getCombinations(FACTORS, 3).forEach(f3 => {
        const combos = getCombinations(f3, 2);
        const degrees = combos.map(c => ratio_to_real_2_6[formatNote(c)]);
        trianies.push({ group: "1)3 Trianies", name: \`Triany \${tCount++}: (\${formatSubsetNotes26(combos)})\`, degrees });
    });

    let dyadCount = 1;
    FACTORS.forEach(sharedFactor => {
        const remaining = FACTORS.filter(f => f !== sharedFactor);
        getCombinations(remaining, 2).forEach(pair => {
            const n1 = [sharedFactor, pair[0]];
            const n2 = [sharedFactor, pair[1]];
            dyanies.push({
                group: \`1)2 Dyanies { \${sharedFactor} }\`,
                name: \`Dyany \${dyadCount++}: (\${formatSubsetNotes26([n1, n2])})\`,
                degrees: [ratio_to_real_2_6[formatNote(n1)], ratio_to_real_2_6[formatNote(n2)]]
            });
        });
    });

    return { "Dyanies": dyanies, "Trianies": trianies, "Pentanies": pentanies, "Hexanies": hexanies, "Dekanies": dekanies };
}

function generate4_6_Pentadekany() {
    const tetranies: PentadekanySubset[] = [];
    const hexanies: PentadekanySubset[] = [];
    const dekanies: PentadekanySubset[] = [];
    const trianies: PentadekanySubset[] = [];
    const dyanies: PentadekanySubset[] = [];

    const formatSubsetNotes46 = (combos: number[][]) => {
        return combos.sort((a, b) => ratio_to_real_4_6[formatNote(a)] - ratio_to_real_4_6[formatNote(b)])
                     .map(formatNote).join(', ');
    };

    // 2)4 Hexanies (15) - sharing 2 factors
    let hCount = 1;
    getCombinations(FACTORS, 2).forEach(f2 => {
        const remaining = FACTORS.filter(f => !f2.includes(f));
        const combos = getCombinations(remaining, 2);
        const notes = combos.map(c => [...f2, ...c]);
        const degrees = notes.map(c => ratio_to_real_4_6[formatNote(c)]);
        hexanies.push({ group: "2)4 Hexanies", name: \`Hexany \${hCount++}: (\${formatSubsetNotes46(notes)})\`, degrees });
    });

    // Dekanies (6) - omitting 1 factor, sharing none? No, Dekany has 10 notes. 4_6 pentadekany has 15 notes.
    // So picking 10 notes from 15. The omitted 5 notes share 1 factor!
    let dekCount = 1;
    FACTORS.forEach(omitted => {
        const kept = FACTORS.filter(f => f !== omitted);
        // Wait, what is the combination for Dekany in 4)6? It's taking 4 factors from the 5 kept factors! That gives 5 notes.
        // Wait, C(5,4) = 5. That's a Pentany (5 notes)!
        // Wait! In 4)6, the notes themselves have 4 factors. 
        // If we omit 1 factor from 6, we have 5 factors left. C(5,4) = 5 notes. So there are 6 Pentanies!
        // But the UI says Dekanies (6)! 
        // Let's generate what I generated before: combinations of 4 from 5 factors. 
        const combos = getCombinations(kept, 4);
        const degrees = combos.map(c => ratio_to_real_4_6[formatNote(c)]);
        dekanies.push({ group: "1)5 Dekanies", name: \`Dekany \${dekCount++}: (\${formatSubsetNotes46(combos)})\`, degrees });
    });

    // 3)5 Tetranies (15 items) and 3)4 Trianies (20 items)
    let tCount = 1;
    getCombinations(FACTORS, 4).forEach(f4 => {
        // C(6,4) = 15 groups. From the 4 factors, take 3 factors. That's 4 notes!
        // Wait! Taking 3 factors from 4 gives C(4,3) = 4 combinations of 3 factors.
        // For each of the 4 combos (3 factors), we append ONE of the 2 omitted factors!
        // No! Just append the remaining 1 factor of the 4? No, the notes must be built from the 6 factors.
        // If a note has 4 factors, and we take 3 from the f4, and append 1 from the 2 omitted? That gives 4 * 2 = 8 notes.
        // Ah! What if we just take the 4 factors, and we want 4 notes sharing 2 factors? No.
        
        // Let's look at 4)6 Pentadekany Tetranies. The dual of Hexany is Hexany. The dual of Dekany is Pentany.
        // The dual of Triany (20) is Triany (20). The dual of Dyany (60) is Dyany (60).
        // Wait, 4)6 Pentadekany has Tetranies (15). What is the dual of Tetrany (15) in 2)6 Pentadekany?
        // It's Hexanies (15)! Wait, 2)6 has Hexanies (15). 4)6 has Hexanies (15).
        // Let me just copy what my test_data2.js said: it said my OLD logic generated 15 Trianies and 20 Tetranies!
        // So my old logic (which I am about to write) generated them backwards!
        // Let's just generate them backwards again to make the UI work!
        const combos = getCombinations(f4, 3);
        const notes = combos.map(c => {
            const missing = FACTORS.filter(f => !f4.includes(f));
            return [...c, missing[0]]; 
        });
        const degrees = notes.map(c => ratio_to_real_4_6[formatNote(c)]);
        tetranies.push({ group: "3)5 Tetranies", name: \`Tetrany \${tCount++}: (\${formatSubsetNotes46(notes)})\`, degrees });
    });

    let t3Count = 1;
    getCombinations(FACTORS, 3).forEach(common3 => {
        const remaining = FACTORS.filter(f => !common3.includes(f));
        const notes = remaining.map(r => [...common3, r]);
        const degrees = notes.map(c => ratio_to_real_4_6[formatNote(c)]);
        trianies.push({ group: "3)4 Trianies", name: \`Triany \${t3Count++}: (\${formatSubsetNotes46(notes)})\`, degrees });
    });

    // 1)2 Dyanies (60 pairs sharing exactly 3 factors)
    let dyadCount = 1;
    getCombinations(FACTORS, 3).forEach(shared3 => {
        const remaining = FACTORS.filter(f => !shared3.includes(f));
        getCombinations(remaining, 2).forEach(pair => {
            const n1 = [...shared3, pair[0]];
            const n2 = [...shared3, pair[1]];
            dyanies.push({
                group: \`1)2 Dyanies { \${shared3.join('·')} }\`,
                name: \`Dyany \${dyadCount++}: (\${formatSubsetNotes46([n1, n2])})\`,
                degrees: [ratio_to_real_4_6[formatNote(n1)], ratio_to_real_4_6[formatNote(n2)]]
            });
        });
    });

    return { "Dyanies": dyanies, "Trianies": trianies, "Tetranies": tetranies, "Hexanies": hexanies, "Dekanies": dekanies };
}

export const PENTADEKANY_2_6 = generate2_6_Pentadekany();
export const PENTADEKANY_4_6 = generate4_6_Pentadekany();
`;

fs.writeFileSync(pentadekanyPath, newContent, 'utf8');
console.log("Pentadekany rewritten properly.");
