// mos.ts
import { mod, uniqueSorted, arraysEqual, gcd } from './mathUtils';
import { normalizePCs, getValidGenerators, intervalClassVector } from './edoBase';
import { primeForm } from './set-theory';

/**
 * Genera una escala basada en un generador y cantidad de pasos.
 */
export function tryGenerateScale(generator: number, numSteps: number, edo: number): number[] {
    const scale = [0];
    let currentPitch = 0;

    for (let i = 0; i < numSteps - 1; i++) {
        currentPitch = mod(currentPitch + generator, edo);
        scale.push(currentPitch);
    }
    return uniqueSorted(scale);
}

/**
 * Verifica si dos escalas son iguales bajo cualquier transposición.
 */
export function areTranspositionsEqual(scale1: number[], scale2: number[], edo: number): boolean {
    if (scale1.length !== scale2.length) return false;

    for (let t = 0; t < edo; t++) {
        const transposed = uniqueSorted(scale1.map(pc => mod(pc + t, edo)));
        if (arraysEqual(transposed, scale2)) {
            return true;
        }
    }
    return false;
}

export interface MosAnalysisResult {
    isMOS: boolean;
    reason: string;
    generator?: number;
    complementGenerator?: number;
    generatorPair?: number[];
    intervalSizes?: number[];
    smallStep?: number;
    largeStep?: number;
    stepPattern?: number[];
    scaleType?: string;
    testedGenerators?: number[][];
}

/**
 * Verifica si un set es un MOS (Moment of Symmetry).
 */
export function isMOS(pcSet: number[], edo: number): MosAnalysisResult {
    const normalized = uniqueSorted(normalizePCs(pcSet, edo));
    const numNotes = normalized.length;

    if (numNotes < 2) {
        return { isMOS: false, reason: "Necesita al menos 2 notas" };
    }

    const intervals: number[] = [];
    for (let i = 0; i < numNotes; i++) {
        const nextIndex = (i + 1) % numNotes;
        const interval = mod(normalized[nextIndex] - normalized[i], edo);
        intervals.push(interval);
    }

    const uniqueIntervals = uniqueSorted(intervals);

    if (uniqueIntervals.length !== 2) {
        if (uniqueIntervals.length === 1) {
            return {
                isMOS: false,
                reason: "Escala igualmente espaciada - NO es MOS según Wilson (no generada por par coprime)",
                intervalSizes: uniqueIntervals,
                stepPattern: intervals
            };
        } else {
            return {
                isMOS: false,
                reason: `Tiene ${uniqueIntervals.length} tamaños de paso (MOS requiere exactamente 2)`,
                intervalSizes: uniqueIntervals,
                stepPattern: intervals
            };
        }
    }

    const validGenerators = getValidGenerators(edo);
    let foundGenerator: number | null = null;

    for (const genPair of validGenerators) {
        for (const gen of genPair) {
            const generatedScale = tryGenerateScale(gen, numNotes, edo);
            if (areTranspositionsEqual(generatedScale, normalized, edo)) {
                foundGenerator = gen;
                break;
            }
        }
        if (foundGenerator !== null) break;
    }

    if (foundGenerator !== null) {
        const smallStep = uniqueIntervals[0];
        const largeStep = uniqueIntervals[1];
        const complementGen = mod(edo - foundGenerator, edo);
        const pair = sortNumbers([foundGenerator, complementGen]);

        return {
            isMOS: true,
            generator: foundGenerator,
            complementGenerator: complementGen,
            generatorPair: pair,
            intervalSizes: uniqueIntervals,
            smallStep,
            largeStep,
            stepPattern: intervals,
            scaleType: `${numNotes}/${edo}`,
            reason: `MOS válido generado por ${foundGenerator} (par coprime: ${pair})`
        };
    } else {
        return {
            isMOS: false,
            reason: `Tiene 2 tamaños de paso pero NO puede ser generado por ningún par coprime válido en ${edo} EDO`,
            intervalSizes: uniqueIntervals,
            stepPattern: intervals,
            testedGenerators: validGenerators
        };
    }
}

/**
 * Función auxiliar para JS.
 */
function sortNumbers(arr: number[]): number[] {
    return [...arr].sort((a, b) => a - b);
}

/**
 * Convierte un Step Pattern (patrón de intervalos) a un Pitch Class Set.
 */
export function stepsToSet(stepPattern: number[], startPitch = 0, edo: number): number[] {
    let pitchClasses = [startPitch];
    let currentPitch = startPitch;

    for (const step of stepPattern) {
        currentPitch = mod(currentPitch + step, edo);
        pitchClasses.push(currentPitch);
    }

    // Se remueve la última nota porque al dar toda la vuelta será la octava
    return pitchClasses.slice(0, -1);
}

/**
 * Convierte un Pitch Class Set a un Step Pattern (patrón de intervalos).
 */
export function setToSteps(pcSet: number[], edo: number): number[] {
    const normalized = uniqueSorted(normalizePCs(pcSet, edo));
    const numNotes = normalized.length;
    const steps: number[] = [];

    if (numNotes === 0) return steps;

    for (let i = 0; i < numNotes; i++) {
        const nextIndex = (i + 1) % numNotes;
        const interval = mod(normalized[nextIndex] - normalized[i], edo);
        steps.push(interval);
    }

    return steps;
}

export interface MosResult {
    numNotes: number;
    intervalSizes: number[];
    smallStep: number;
    largeStep: number;
    stepPattern: number[];
}

/**
 * Verifica si el generador abarca una cantidad constante de pasos en toda la escala.
 * Esta es la propiedad definitoria estricta de un MOS (relacionado a la propiedad de Myhill).
 */
function checkGeneratorSpan(pcSet: number[], generator: number, edo: number): boolean {
    if (pcSet.length <= 1) return true;
    
    // El span (número de pasos) que toma el generador desde la primera nota (que es 0)
    const expectedSpan = pcSet.indexOf(generator);
    if (expectedSpan === -1) return false; // El generador debería estar en el set siempre
    
    for (let i = 0; i < pcSet.length; i++) {
        const p1 = pcSet[i];
        const p2 = mod(p1 + generator, edo);
        
        const idx2 = pcSet.indexOf(p2);
        // Si p2 no está, es el salto final (lobo) de la cadena generadora, se ignora.
        if (idx2 === -1) continue;
        
        let span = idx2 - i;
        if (span < 0) span += pcSet.length;
        
        if (span !== expectedSpan) return false;
    }
    
    return true;
}

/**
 * Genera todos los MOS primarios para un EDO y un generador dados.
 */
export function generateAllMOS(edo: number, generator: number): MosResult[] {
    const results: MosResult[] = [];
    
    // Probar todos los tamaños posibles de escala (entre 2 y EDO notas inclusive)
    for (let numNotes = 2; numNotes <= edo; numNotes++) {
        // Generar la escala
        const scale = tryGenerateScale(generator, numNotes, edo);
        
        // Si el tamaño real de la escala es menor al esperado (ciclo cerrado precoz), saltear
        if (scale.length !== numNotes) continue;

        // Calcular intervalos
        const steps = setToSteps(scale, edo);
        const uniqueIntervals = uniqueSorted(steps);
        
        // Un MOS válido en EDO es aquel con exactamente 2 tamaños de pasos,
        // cuyas cantidades (copias de L y s) son números coprimos,
        // y donde el generador mantiene un span constante de grados de escala.
        if (uniqueIntervals.length === 2) {
            const smallStep = uniqueIntervals[0];
            const largeStep = uniqueIntervals[1];
            const sCount = steps.filter(s => s === smallStep).length;
            const lCount = steps.filter(s => s === largeStep).length;
            
            const pcSet = stepsToSet(steps, 0, edo);
            
            if (gcd(sCount, lCount) === 1 && checkGeneratorSpan(pcSet, generator, edo)) {
                results.push({
                    numNotes,
                    intervalSizes: uniqueIntervals,
                    smallStep,
                    largeStep,
                    stepPattern: steps
                });
            }
        } else if (uniqueIntervals.length === 1 && numNotes === edo) {
            // El EDO completo se considera el MOS de tamaño máximo (Ej. 5/12 en 12 EDO)
            results.push({
                numNotes,
                intervalSizes: uniqueIntervals,
                smallStep: uniqueIntervals[0],
                largeStep: uniqueIntervals[0],
                stepPattern: steps
            });
        }
    }
    
    return results;
}

export interface SubMosGroup {
    primeForm: number[];
    primeFormStr: string;
    stepPattern: number[];
    icv: number[];
    isPure: boolean;
    isZRelated: boolean;
}

export interface SubMosLevel {
    size: number;
    groups: SubMosGroup[];
    pureSequence: number[];
}

/**
 * Genera el árbol de MOS secundarios de Terumi Narushima de forma recursiva.
 * Empieza desde startParentSize y extrae sub-segmentos de la cadena generadora,
 * identificando el "MOS Puro" de cada subnivel, el cual se convierte en la cadena padre
 * para el subnivel siguiente.
 */
export function generateNarushimaTree(edo: number, generator: number, startParentSize: number): SubMosLevel[] {
    const levels: SubMosLevel[] = [];
    
    // Cadena inicial (MOS padre) en el orden de los saltos de generador
    let currentChain: number[] = [];
    for (let i = 0; i < startParentSize; i++) {
        currentChain.push(mod(i * generator, edo));
    }
    
    // En la teoría de Narushima, los subniveles corresponden a los tamaños de los MOS primarios
    const allPrimaryMos = generateAllMOS(edo, generator);
    const mosSizes = allPrimaryMos
        .map(m => m.numNotes)
        .filter(size => size < startParentSize && size >= 3)
        .sort((a, b) => b - a); // Orden descendente
    
    for (const targetSize of mosSizes) {
        const chainLen = currentChain.length;
        const groupsMap = new Map<string, SubMosGroup>();
        let nextPureChain: number[] | null = null;
        
        for (let k = 0; k < chainLen; k++) {
            // Extraer un segmento contiguo envolviendo (wrap-around)
            const subset: number[] = [];
            for (let j = 0; j < targetSize; j++) {
                subset.push(currentChain[(k + j) % chainLen]);
            }
            
            // Analizar el subconjunto
            const pf = primeForm(subset, edo);
            const pfStr = pf.join(',');
            
            if (!groupsMap.has(pfStr)) {
                // Sacar el step pattern de la Prime Form
                const steps = setToSteps(pf, edo);
                const uniqueSteps = uniqueSorted(steps);
                const isPure = uniqueSteps.length === 2;
                const icv = intervalClassVector(pf, edo);
                
                groupsMap.set(pfStr, {
                    primeForm: pf,
                    primeFormStr: pfStr,
                    stepPattern: steps,
                    icv,
                    isPure,
                    isZRelated: false
                });
                
                // El MOS que es "puro" (sin disyunción) mantiene su orden de generador
                // y se convierte en la cadena para el siguiente nivel.
                if (isPure && !nextPureChain) {
                    nextPureChain = subset;
                }
            }
        }
        
        const groups = Array.from(groupsMap.values());
        
        // Verificación de relaciones Z (mismo ICV, distinta Prime Form en el mismo nivel)
        for (let i = 0; i < groups.length; i++) {
            for (let j = i + 1; j < groups.length; j++) {
                if (groups[i].icv.join(',') === groups[j].icv.join(',')) {
                    groups[i].isZRelated = true;
                    groups[j].isZRelated = true;
                }
            }
        }
        
        levels.push({
            size: targetSize,
            groups,
            pureSequence: nextPureChain || []
        });
        
        if (!nextPureChain) {
            break; // Si por algún error teórico no hay MOS puro, detenemos la recursión.
        }
        currentChain = nextPureChain;
    }
    
    return levels;
}
