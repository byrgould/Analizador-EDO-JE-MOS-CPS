// set-theory.ts
import { mod, uniqueSorted } from './mathUtils.ts';
import { normalizePCs } from './edoBase.ts';

/**
 * Encuentra la Forma Normal (Normal Form) de un set siguiendo el algoritmo canónico de Rahn.
 * 1. Genera todas las rotaciones cíclicas del conjunto ordenado.
 * 2. Compara los intervalos desde el extremo exterior hacia el interior (k-1, k-2, ..., 1)
 *    para encontrar la rotación más compacta (menor dispersión).
 * 3. En caso de simetría exacta, desempata por el tono inicial menor.
 */
export function normalForm(pcSet: number[], edo: number): number[] {
    const pcs = uniqueSorted(normalizePCs(pcSet, edo));
    const n = pcs.length;
    if (n < 2) return pcs;

    const rotations: number[][] = [];
    for (let i = 0; i < n; i++) {
        rotations.push([...pcs.slice(i), ...pcs.slice(0, i)]);
    }

    let candidates = rotations;

    for (let offset = n - 1; offset >= 1; offset--) {
        let minSpan = edo;
        let nextCandidates: number[][] = [];

        for (const rot of candidates) {
            const span = mod(rot[offset] - rot[0], edo);
            if (span < minSpan) {
                minSpan = span;
                nextCandidates = [rot];
            } else if (span === minSpan) {
                nextCandidates.push(rot);
            }
        }

        candidates = nextCandidates;
        if (candidates.length === 1) break;
    }

    if (candidates.length > 1) {
        candidates.sort((a, b) => a[0] - b[0]);
    }

    return candidates[0];
}

/**
 * Realiza una Transposición matemática simple y normalizada.
 */
export function transposeSet(pcSet: number[], n: number, edo: number): number[] {
    return normalizePCs(pcSet.map(pc => pc + n), edo);
}

/**
 * Realiza una Inversión matemática simple (n - pc) y normalizada.
 */
export function invertSet(pcSet: number[], n: number, edo: number): number[] {
    return normalizePCs(pcSet.map(pc => n - pc), edo);
}

/**
 * Operación Tn de Set Theory: Transposición devolviendo la Forma Normal.
 */
export function Tn(pcSet: number[], n: number, edo: number): number[] {
    const transposed = transposeSet(pcSet, n, edo);
    return normalForm(transposed, edo);
}

/**
 * Operación In de Set Theory: Inversión devolviendo la Forma Normal.
 */
export function In(pcSet: number[], n: number, edo: number): number[] {
    const inverted = invertSet(pcSet, n, edo);
    return normalForm(inverted, edo);
}

/**
 * Calcula la Prime Form de un set bajo el estándar canónico de Allen Forte y John Rahn.
 * 1. Obtiene la Forma Normal del conjunto original y de su inversión.
 * 2. Transpone ambas al origen 0 (T_0).
 * 3. Compara elemento a elemento desde la izquierda (índice 1 en adelante) para seleccionar
 *    la forma más empaquetada hacia el origen (most packed to the left).
 */
export function primeForm(pcSet: number[], edo: number): number[] {
    const nf = normalForm(pcSet, edo);
    if (nf.length === 0) return [];

    const inverted = invertSet(pcSet, 0, edo);
    const invertedNF = normalForm(inverted, edo);

    const transposedNormal = transposeSet(nf, -nf[0], edo);
    const transposedInverted = transposeSet(invertedNF, -invertedNF[0], edo);

    for (let i = 1; i < transposedNormal.length; i++) {
        if (transposedNormal[i] < transposedInverted[i]) return transposedNormal;
        if (transposedInverted[i] < transposedNormal[i]) return transposedInverted;
    }

    return transposedNormal;
}
