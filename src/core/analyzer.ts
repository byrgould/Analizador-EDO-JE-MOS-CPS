// analyzer.ts
import { normalizePCs, intervalClassVector, getComplement, transpositionalSymmetry, inversionalSymmetry, validateEDO } from './edoBase';
import { normalForm, primeForm } from './set-theory';
import { isMOS } from './mos';
import type { MosAnalysisResult } from './mos';
import { uniqueSorted } from './mathUtils';

export interface FullAnalysisResult {
    edo: number;
    inputSet: number[];
    normalizedSet: number[];
    normalForm: number[];
    complement: number[];
    primeForm: number[];
    primeFormComplement: number[];
    intervalClassVector: number[];
    transpositionalSymmetry: { degree: number; transpositions: number[] };
    inversionalSymmetry: { degree: number; indices: number[] };
    mosAnalysis: MosAnalysisResult;
}

export function analyzeSet(pcSet: number[], edo: number): FullAnalysisResult {
    if (!validateEDO(edo)) {
        throw new Error(`Invalid EDO. Please use one of: 12, 19, 31, 41, 53`);
    }

    const normalizedSet = uniqueSorted(normalizePCs(pcSet, edo));
    const nf = normalForm(normalizedSet, edo);
    const complement = getComplement(normalizedSet, edo);
    const pf = primeForm(normalizedSet, edo);
    const pfComplement = primeForm(complement, edo);
    const icVector = intervalClassVector(normalizedSet, edo);
    const tSymmetry = transpositionalSymmetry(normalizedSet, edo);
    const iSymmetry = inversionalSymmetry(normalizedSet, edo);
    const mosRes = isMOS(normalizedSet, edo);

    return {
        edo,
        inputSet: pcSet,
        normalizedSet,
        normalForm: nf,
        complement,
        primeForm: pf,
        primeFormComplement: pfComplement,
        intervalClassVector: icVector,
        transpositionalSymmetry: tSymmetry,
        inversionalSymmetry: iSymmetry,
        mosAnalysis: mosRes
    };
}
