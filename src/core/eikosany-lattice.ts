export interface LatticeNode {
    degree: number;
    label: string;
    x: number;
    y: number;
}

export interface LatticeEdge {
    sourceDegree: number;
    targetDegree: number;
}

const OUTER_NOTES = [
    { label: "3·5·11", degree: 11 },
    { label: "1·3·5", degree: 28 },
    { label: "3·5·7", degree: 22 },
    { label: "1·5·7", degree: 4 },
    { label: "5·7·9", degree: 9 },
    { label: "1·7·9", degree: 30 },
    { label: "7·9·11", degree: 13 },
    { label: "1·9·11", degree: 19 },
    { label: "3·9·11", degree: 6 },
    { label: "1·3·11", degree: 1 },
];

const INNER_NOTES = [
    { label: "3·5·9", degree: 2 },
    { label: "1·3·7", degree: 12 },
    { label: "5·7·11", degree: 18 },
    { label: "1·5·9", degree: 15 },
    { label: "3·7·9", degree: 17 },
    { label: "1·7·11", degree: 8 },
    { label: "5·9·11", degree: 29 },
    { label: "1·3·9", degree: 23 },
    { label: "3·7·11", degree: 26 },
    { label: "1·5·11", degree: 24 },
];

export function getEikosanyLattice(cx: number, cy: number, rOuter: number, rInner: number) {
    const nodes: LatticeNode[] = [];
    
    // Outer Decagon
    for (let i = 0; i < 10; i++) {
        const angle = i * (Math.PI / 5) - Math.PI / 2;
        nodes.push({
            degree: OUTER_NOTES[i].degree,
            label: OUTER_NOTES[i].label,
            x: cx + rOuter * Math.cos(angle),
            y: cy + rOuter * Math.sin(angle)
        });
    }

    // Inner Decagon
    for (let i = 0; i < 10; i++) {
        const angle = i * (Math.PI / 5) + (Math.PI / 5) - Math.PI / 2;
        nodes.push({
            degree: INNER_NOTES[i].degree,
            label: INNER_NOTES[i].label,
            x: cx + rInner * Math.cos(angle),
            y: cy + rInner * Math.sin(angle)
        });
    }
    
    const edges: LatticeEdge[] = [];
    const getFactors = (label: string) => label.split('·').map(Number);
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const f1 = getFactors(nodes[i].label);
            const f2 = getFactors(nodes[j].label);
            const intersection = f1.filter(f => f2.includes(f));
            if (intersection.length === 2) {
                edges.push({
                    sourceDegree: nodes[i].degree,
                    targetDegree: nodes[j].degree
                });
            }
        }
    }

    return { nodes, edges };
}
