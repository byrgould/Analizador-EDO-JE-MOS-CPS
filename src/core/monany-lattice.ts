export interface MonanyNode {
    degree: number;
    label: string;
    x: number;
    y: number;
}

export function getMonany0_6Lattice(cx: number, cy: number) {
    const nodes: MonanyNode[] = [
        { degree: 0, label: "∅", x: cx, y: cy }
    ];
    return { nodes, edges: [] };
}

export function getMonany6_6Lattice(cx: number, cy: number) {
    const nodes: MonanyNode[] = [
        { degree: 15, label: "1·3·5·7·9·11", x: cx, y: cy }
    ];
    return { nodes, edges: [] };
}
