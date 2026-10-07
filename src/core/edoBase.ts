// edoBase.ts
import { mod, uniqueSorted } from './mathUtils';

/**
 * Generadores coprimos válidos por cada EDO comúnmente usado.
 */
const VALID_GENERATORS: Record<number, number[][]> = {
    12: [[1, 11], [5, 7]],
    19: [[1, 18], [2, 17], [3, 16], [4, 15], [5, 14], [6, 13], [7, 12], [8, 11], [9, 10]],
    31: [[1, 30], [2, 29], [3, 28], [4, 27], [5, 26], [6, 25], [7, 24], [8, 23], [9, 22], [10, 21], [11, 20], [12, 19], [13, 18], [14, 17], [15, 16]],
    41: [[1, 40], [2, 39], [3, 38], [4, 37], [5, 36], [6, 35], [7, 34], [8, 33], [9, 32], [10, 31], [11, 30], [12, 29], [13, 28], [14, 27], [15, 26], [16, 25], [17, 24], [18, 23], [19, 22], [20, 21]],
    53: [[1, 52], [2, 51], [3, 50], [4, 49], [5, 48], [6, 47], [7, 46], [8, 45], [9, 44], [10, 43], [11, 42], [12, 41], [13, 40], [14, 39], [15, 38], [16, 37], [17, 36], [18, 35], [19, 34], [20, 33], [21, 32], [22, 31], [23, 30], [24, 29], [25, 28], [26, 27]]
};

/**
 * Cantidad de clases de intervalo por EDO.
 */
const INTERVAL_CLASSES: Record<number, number> = {
    12: 6,
    19: 9,
    31: 15,
    41: 20,
    53: 26
};

/**
 * Validar si el EDO está soportado.
 */
export function validateEDO(edo: number): boolean {
    return [12, 19, 31, 41, 53].includes(edo);
}

/**
 * Obtiene el número de clases de intervalos posibles para un EDO.
 */
export function getNumIntervalClasses(edo: number): number {
    return INTERVAL_CLASSES[edo] || Math.floor(edo / 2);
}

/**
 * Devuelve pares de generadores válidos para un EDO.
 */
export function getValidGenerators(edo: number): number[][] {
    return VALID_GENERATORS[edo] || [];
}

/**
 * Normaliza un pitch class (ej: 13 en 12-EDO -> 1).
 */
export function normalizePCs(pcs: number[], edo: number): number[] {
    return pcs.map(pc => mod(pc, edo));
}

/**
 * Calcula la clase de intervalo (la distancia más corta) entre dos pitch classes.
 */
export function intervalClass(pc1: number, pc2: number, edo: number): number {
    const diff1 = mod(pc1 - pc2, edo);
    const diff2 = mod(pc2 - pc1, edo);
    return Math.min(diff1, diff2);
}

/**
 * Genera un vector de clases de intervalo para un set.
 */
export function intervalClassVector(pcSet: number[], edo: number): number[] {
    const normalized = uniqueSorted(normalizePCs(pcSet, edo));
    const numICs = getNumIntervalClasses(edo);
    const vector = new Array(numICs).fill(0);

    for (let i = 0; i < normalized.length; i++) {
        for (let j = i + 1; j < normalized.length; j++) {
            const ic = intervalClass(normalized[i], normalized[j], edo);
            if (ic > 0 && ic <= numICs) {
                vector[ic - 1] += 1;
            }
        }
    }
    return vector;
}

/**
 * Calcula el complemento de un set en un determinado EDO.
 */
export function getComplement(pcSet: number[], edo: number): number[] {
    const normalized = new Set(normalizePCs(pcSet, edo));
    const allPCs = Array.from({ length: edo }, (_, i) => i);
    return allPCs.filter(pc => !normalized.has(pc));
}

/**
 * Chequea grado de simetría transposicional
 */
export function transpositionalSymmetry(pcSet: number[], edo: number) {
    const normalized = uniqueSorted(normalizePCs(pcSet, edo));
    const symmetries = [0];

    for (let n = 1; n < edo; n++) {
        const transposed = uniqueSorted(normalizePCs(normalized.map(pc => pc + n), edo));
        if (transposed.join(',') === normalized.join(',')) {
            symmetries.push(n);
        }
    }
    return { degree: symmetries.length, transpositions: symmetries };
}

/**
 * Chequea grado de simetría inversional
 */
export function inversionalSymmetry(pcSet: number[], edo: number) {
    const normalized = uniqueSorted(normalizePCs(pcSet, edo));
    const symmetries: number[] = [];

    for (let n = 0; n < edo; n++) {
        const inverted = uniqueSorted(normalizePCs(normalized.map(pc => n - pc), edo));
        if (inverted.join(',') === normalized.join(',')) {
            symmetries.push(n);
        }
    }
    return { degree: symmetries.length, indices: symmetries };
}
