export interface HexanyNode {
    degree: number;
    label: string;
    x: number;
    y: number;
    factors?: number[];
}

export interface HexanyEdge {
    sourceDegree: number;
    targetDegree: number;
}

// 1)6 Hexany (6 nodos): Pentágono con punta a las 12 p.m., nodo en el centro
const NOTES_1_6 = [
    { label: "3", degree: 25, angleDeg: -90 },  // 12 o'clock
    { label: "5", degree: 14, angleDeg: -18 },
    { label: "7", degree: 34, angleDeg: 54 },
    { label: "9", degree: 7, angleDeg: 126 },
    { label: "11", degree: 21, angleDeg: 198 }
];
const CENTER_1_6 = { label: "1", degree: 0 };

// 5)6 Hexany (6 nodos): Pentágono con punta a las 6 p.m., nodo en el centro
const NOTES_5_6 = [
    { label: "1·5·7·9·11", degree: 32, angleDeg: 90 },   // 6 o'clock (omit 3)
    { label: "1·3·7·9·11", degree: 1, angleDeg: 162 },   // (omit 5)
    { label: "1·3·5·9·11", degree: 23, angleDeg: 234 },  // (omit 7)
    { label: "1·3·5·7·11", degree: 8, angleDeg: 306 },   // (omit 9)
    { label: "1·3·5·7·9", degree: 36, angleDeg: 18 }     // (omit 11)
];
const CENTER_5_6 = { label: "3·5·7·9·11", degree: 15 }; // (omit 1)


export function getHexany1_6Lattice(cx: number, cy: number, rOuter: number) {
    const nodes: HexanyNode[] = [];
    const edges: HexanyEdge[] = [];

    // Outer nodes
    for (let i = 0; i < NOTES_1_6.length; i++) {
        const item = NOTES_1_6[i];
        const angleRad = item.angleDeg * (Math.PI / 180);
        nodes.push({
            degree: item.degree,
            label: item.label,
            x: cx + rOuter * Math.cos(angleRad),
            y: cy + rOuter * Math.sin(angleRad)
        });
    }

    // Center node
    nodes.push({
        degree: CENTER_1_6.degree,
        label: CENTER_1_6.label,
        x: cx,
        y: cy
    });

    // Edges (fully connected to center, and connected as a perimeter)
    for (let i = 0; i < NOTES_1_6.length; i++) {
        // Perimeter
        const next = (i + 1) % NOTES_1_6.length;
        edges.push({
            sourceDegree: NOTES_1_6[i].degree,
            targetDegree: NOTES_1_6[next].degree
        });
        
        // To center
        edges.push({
            sourceDegree: NOTES_1_6[i].degree,
            targetDegree: CENTER_1_6.degree
        });
    }

    return { nodes, edges };
}

export function getHexany5_6Lattice(cx: number, cy: number, rOuter: number) {
    const nodes: HexanyNode[] = [];
    const edges: HexanyEdge[] = [];

    // Outer nodes
    for (let i = 0; i < NOTES_5_6.length; i++) {
        const item = NOTES_5_6[i];
        const angleRad = item.angleDeg * (Math.PI / 180);
        nodes.push({
            degree: item.degree,
            label: item.label,
            x: cx + rOuter * Math.cos(angleRad),
            y: cy + rOuter * Math.sin(angleRad)
        });
    }

    // Center node
    nodes.push({
        degree: CENTER_5_6.degree,
        label: CENTER_5_6.label,
        x: cx,
        y: cy
    });

    // Edges (fully connected to center, and connected as a perimeter)
    for (let i = 0; i < NOTES_5_6.length; i++) {
        // Perimeter
        const next = (i + 1) % NOTES_5_6.length;
        edges.push({
            sourceDegree: NOTES_5_6[i].degree,
            targetDegree: NOTES_5_6[next].degree
        });
        
        // To center
        edges.push({
            sourceDegree: NOTES_5_6[i].degree,
            targetDegree: CENTER_5_6.degree
        });
    }

    return { nodes, edges };
}
