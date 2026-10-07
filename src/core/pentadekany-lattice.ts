export interface PentadekanyNode {
    degree: number;
    label: string;
    x: number;
    y: number;
    factors: number[];
}

export interface PentadekanyEdge {
    sourceDegree: number;
    targetDegree: number;
}

const OUTER_NOTES_2_6 = [
    { label: "1·3", degree: 25, angleDeg: 90 },
    { label: "1·11", degree: 21, angleDeg: 162 },
    { label: "5·11", degree: 33, angleDeg: 234 },
    { label: "5·9", degree: 22, angleDeg: 306 },
    { label: "3·9", degree: 31, angleDeg: 18 },
];

const MIDDLE_NOTES_2_6 = [
    { label: "5·7", degree: 6, angleDeg: -90 },
    { label: "7·9", degree: 41, angleDeg: -18 },
    { label: "3·7", degree: 17, angleDeg: 54 },
    { label: "1·7", degree: 34, angleDeg: 126 },
    { label: "7·11", degree: 12, angleDeg: 198 },
];

const INNER_NOTES_2_6 = [
    { label: "9·11", degree: 27, angleDeg: -90 },
    { label: "3·5", degree: 37, angleDeg: -18 },
    { label: "1·9", degree: 7, angleDeg: 54 },
    { label: "3·11", degree: 2, angleDeg: 126 },
    { label: "1·5", degree: 14, angleDeg: 198 },
];

export function getPentadekany2_6Lattice(cx: number, cy: number, rOuter: number) {
    const rMid = rOuter * 0.6; // Radio para el pentágono intermedio
    const rInner = rOuter * 0.2; // Radio para el pentágono interno
    const nodes: PentadekanyNode[] = [];
    const edges: PentadekanyEdge[] = [];

    // 1. Crear Nodos Externos (Pentágono abajo)
    for (let i = 0; i < OUTER_NOTES_2_6.length; i++) {
        const item = OUTER_NOTES_2_6[i];
        const angleRad = item.angleDeg * (Math.PI / 180);
        
        nodes.push({
            degree: item.degree,
            label: item.label,
            x: cx + rOuter * Math.cos(angleRad),
            y: cy + rOuter * Math.sin(angleRad),
            factors: item.label.split('·').map(Number)
        });
    }

    // 2. Crear Nodos Intermedios (Pentágono arriba)
    for (let i = 0; i < MIDDLE_NOTES_2_6.length; i++) {
        const item = MIDDLE_NOTES_2_6[i];
        const angleRad = item.angleDeg * (Math.PI / 180);
        
        nodes.push({
            degree: item.degree,
            label: item.label,
            x: cx + rMid * Math.cos(angleRad),
            y: cy + rMid * Math.sin(angleRad),
            factors: item.label.split('·').map(Number)
        });
    }

    // 3. Crear Nodos Internos (Pentágono arriba)
    for (let i = 0; i < INNER_NOTES_2_6.length; i++) {
        const item = INNER_NOTES_2_6[i];
        const angleRad = item.angleDeg * (Math.PI / 180);
        
        nodes.push({
            degree: item.degree,
            label: item.label,
            x: cx + rInner * Math.cos(angleRad),
            y: cy + rInner * Math.sin(angleRad),
            factors: item.label.split('·').map(Number)
        });
    }

    // 4. Calcular Aristas (Díadas 1)2)
    // Conectamos todos los nodos que comparten exactamente 1 factor
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const sharedFactors = nodes[i].factors.filter(f => nodes[j].factors.includes(f));
            if (sharedFactors.length === 1) { // They share a factor
                edges.push({
                    sourceDegree: nodes[i].degree,
                    targetDegree: nodes[j].degree
                });
            }
        }
    }

    return { nodes, edges };
}

// ============================================
// 4)6 PENTADEKANY LATTICE
// ============================================

const OUTER_NOTES_4_6 = [
    { label: "5·7·9·11", degree: 32, angleDeg: -90 },
    { label: "3·5·7·9", degree: 36, angleDeg: -18 },
    { label: "1·3·7·9", degree: 24, angleDeg: 54 },
    { label: "1·3·7·11", degree: 35, angleDeg: 126 },
    { label: "1·5·7·11", degree: 26, angleDeg: 198 },
];

const MIDDLE_NOTES_4_6 = [
    { label: "1·3·9·11", degree: 9, angleDeg: 90 },
    { label: "1·3·5·11", degree: 16, angleDeg: 162 },
    { label: "1·5·9·11", degree: 40, angleDeg: 234 },
    { label: "3·5·9·11", degree: 23, angleDeg: 306 },
    { label: "1·3·5·9", degree: 3, angleDeg: 18 },
];

const INNER_NOTES_4_6 = [
    { label: "1·3·5·7", degree: 30, angleDeg: 90 },
    { label: "1·7·9·11", degree: 20, angleDeg: 162 },
    { label: "3·5·7·11", degree: 8, angleDeg: 234 },
    { label: "1·5·7·9", degree: 13, angleDeg: 306 },
    { label: "3·7·9·11", degree: 1, angleDeg: 18 },
];

export function getPentadekany4_6Lattice(cx: number, cy: number, rOuter: number) {
    const rMid = rOuter * 0.6;
    const rInner = rOuter * 0.2;
    const nodes: PentadekanyNode[] = [];
    const edges: PentadekanyEdge[] = [];

    // 1. Crear Nodos Externos (Pentágono apuntando hacia arriba)
    for (let i = 0; i < OUTER_NOTES_4_6.length; i++) {
        const item = OUTER_NOTES_4_6[i];
        const angleRad = item.angleDeg * (Math.PI / 180);
        
        nodes.push({
            degree: item.degree,
            label: item.label,
            x: cx + rOuter * Math.cos(angleRad),
            y: cy + rOuter * Math.sin(angleRad),
            factors: item.label.split('·').map(Number)
        });
    }

    // 2. Crear Nodos Intermedios (Pentágono apuntando hacia abajo)
    for (let i = 0; i < MIDDLE_NOTES_4_6.length; i++) {
        const item = MIDDLE_NOTES_4_6[i];
        const angleRad = item.angleDeg * (Math.PI / 180);
        
        nodes.push({
            degree: item.degree,
            label: item.label,
            x: cx + rMid * Math.cos(angleRad),
            y: cy + rMid * Math.sin(angleRad),
            factors: item.label.split('·').map(Number)
        });
    }

    // 3. Crear Nodos Internos (Pentágono apuntando hacia abajo)
    for (let i = 0; i < INNER_NOTES_4_6.length; i++) {
        const item = INNER_NOTES_4_6[i];
        const angleRad = item.angleDeg * (Math.PI / 180);
        
        nodes.push({
            degree: item.degree,
            label: item.label,
            x: cx + rInner * Math.cos(angleRad),
            y: cy + rInner * Math.sin(angleRad),
            factors: item.label.split('·').map(Number)
        });
    }

    // 4. Calcular Aristas (Díadas recíprocas)
    // Conectamos todos los nodos que comparten exactamente 3 factores
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const sharedFactors = nodes[i].factors.filter(f => nodes[j].factors.includes(f));
            if (sharedFactors.length === 3) {
                edges.push({
                    sourceDegree: nodes[i].degree,
                    targetDegree: nodes[j].degree
                });
            }
        }
    }

    return { nodes, edges };
}
