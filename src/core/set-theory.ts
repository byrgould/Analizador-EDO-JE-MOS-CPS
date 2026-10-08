// set-theory.ts
import { mod, uniqueSorted } from './mathUtils';
import { normalizePCs } from './edoBase';

/**
 * Desempata la packedness empacando hacia abajo (convención estándar de Set Theory).
 */
function comparePackedness(rot1: number[], rot2: number[], edo: number): number[] {
    const intervals1: number[] = [];
    const intervals2: number[] = [];

    for (let i = 0; i < rot1.length - 1; i++) {
        intervals1.push(mod(rot1[i + 1] - rot1[i], edo));
    }
    for (let i = 0; i < rot2.length - 1; i++) {
        intervals2.push(mod(rot2[i + 1] - rot2[i], edo));
    }

    for (let i = 0; i < intervals1.length; i++) {
        if (intervals1[i] < intervals2[i]) return rot1;
        if (intervals2[i] < intervals1[i]) return rot2;
    }
    return rot1;
}

/**
 * Encuentra la Forma Normal (Normal Form) de un set.
 */
export function normalForm(pcSet: number[], edo: number): number[] {
    const pcs = uniqueSorted(normalizePCs(pcSet, edo));
    if (pcs.length < 2) return pcs;

    let rotations: number[][] = [];
    for (let i = 0; i < pcs.length; i++) {
        // En lugar de rotate(i.neg) de SuperCollider, en JS cortamos y pegamos
        const rotation = [...pcs.slice(i), ...pcs.slice(0, i)];
        rotations.push(rotation);
    }

    let bestRotation = pcs;
    let minSpan = edo;

    for (const rotation of rotations) {
        const span = mod(rotation[rotation.length - 1] - rotation[0], edo);
        if (span < minSpan) {
            minSpan = span;
            bestRotation = rotation;
        } else if (span === minSpan) {
            bestRotation = comparePackedness(bestRotation, rotation, edo);
        }
    }

    return bestRotation;
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
 * Calcula la Prime Form de un set.
 */
export function primeForm(pcSet: number[], edo: number): number[] {
    const nf = normalForm(pcSet, edo);
    const inverted = invertSet(pcSet, 0, edo);
    const invertedNF = normalForm(inverted, edo);

    const tNormal = nf.length > 0 ? transposeSet(nf, -nf[0], edo) : nf;
    const tInverted = invertedNF.length > 0 ? transposeSet(invertedNF, -invertedNF[0], edo) : invertedNF;

    if (tNormal.length === 0 || tInverted.length === 0) {
        return tNormal;
    }

    // Comparar intervalos desde la izquierda (empaquetado a la izquierda, convención Forte/Rahn)
    for (let i = 0; i < tNormal.length; i++) {
        if (tNormal[i] < tInverted[i]) return tNormal;
        if (tInverted[i] < tNormal[i]) return tInverted;
    }

    return tNormal;
}
