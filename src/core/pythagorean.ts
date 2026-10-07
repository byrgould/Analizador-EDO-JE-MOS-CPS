/**
 * MÓDULO MATEMÁTICO: AFINACIÓN PITAGÓRICA Y MESOTÓNICA
 * 
 * Este archivo contiene el núcleo matemático para calcular fracciones (ratios) puras
 * usando enteros de precisión arbitraria (BigInt) para evitar desbordes (overflows) 
 * cuando se apilan docenas de quintas justas consecutivas (ej. 3/2 elevado a la 53).
 * 
 * Aquí se definen los algoritmos para:
 * 1. Simplificar fracciones gigantes (máximo común divisor).
 * 2. Calcular los límites de números primos (Prime Limits).
 * 3. Encontrar la "quinta del lobo" (Wolf Fifth) que cierra el círculo en temperamentos como 53-EDO.
 */
// pythagorean.ts

export interface BigRatio {
    n: bigint;
    d: bigint;
    val: number;
    str: string;
    limit: number;
    isWolf?: boolean;
}

export function simplifyBigRatio(n: bigint, d: bigint): [bigint, bigint] {
    let a = n;
    let b = d;
    while (b !== 0n) {
        let t = b;
        b = a % b;
        a = t;
    }
    return [n / a, d / a];
}

export function getBigPrimeLimit(n: bigint): number {
    let maxPrime = 1;
    if (n < 0n) n = -n;
    if (n === 0n || n === 1n) return 1;
    
    while (n % 2n === 0n) { maxPrime = 2; n /= 2n; }
    for (let i = 3n; i * i <= n; i += 2n) {
        while (n % i === 0n) {
            maxPrime = Number(i);
            n /= i;
        }
    }
    if (n > 2n) maxPrime = Number(n);
    return maxPrime;
}

export function generatePythagorean53(): BigRatio[] {
    let ratios: { n: bigint, d: bigint }[] = [];
    
    // (2/3)^0 to (2/3)^26
    for (let i = 0; i < 27; i++) {
        ratios.push({ n: 2n ** BigInt(i), d: 3n ** BigInt(i) });
    }
    // (3/2)^1 to (3/2)^26
    for (let i = 1; i < 27; i++) {
        ratios.push({ n: 3n ** BigInt(i), d: 2n ** BigInt(i) });
    }
    
    // Normalize to [1, 2)
    let normalized = ratios.map(r => {
        let n = r.n;
        let d = r.d;
        let val = Number(n) / Number(d);
        while (val < 1.0) {
            n *= 2n;
            val = Number(n) / Number(d);
        }
        while (val >= 2.0) {
            d *= 2n;
            val = Number(n) / Number(d);
        }
        let [sn, sd] = simplifyBigRatio(n, d);
        return { n: sn, d: sd, val: Number(sn) / Number(sd) };
    });
    
    normalized.sort((a, b) => a.val - b.val);
    
    return normalized.map(r => {
        const limit = Math.max(getBigPrimeLimit(r.n), getBigPrimeLimit(r.d));
        const str = `${r.n}/${r.d}`;
        // A huge limit means it's a very extreme interval (wolf-like)
        return {
            ...r,
            str,
            limit,
            isWolf: limit > 3 || str.length > 15 // If the fraction is huge, mark it as wolf-like
        };
    });
}

export const PYTHAGOREAN_53 = generatePythagorean53();

export interface PythIntervalInfo {
    index: number;
    original: BigRatio;
    interval: BigRatio;
}

export function getIntervalsForPythagoreanDegree(degree: number): PythIntervalInfo[] {
    const base = PYTHAGOREAN_53[degree];
    
    return PYTHAGOREAN_53.map((ratio, index) => {
        // Divide ratio by base
        let n = ratio.n * base.d;
        let d = ratio.d * base.n;
        
        let val = Number(n) / Number(d);
        while (val < 1.0) { n *= 2n; val = Number(n) / Number(d); }
        while (val >= 2.0) { d *= 2n; val = Number(n) / Number(d); }
        
        let [sn, sd] = simplifyBigRatio(n, d);
        const limit = Math.max(getBigPrimeLimit(sn), getBigPrimeLimit(sd));
        const str = `${sn}/${sd}`;
        
        return {
            index,
            original: ratio,
            interval: {
                n: sn,
                d: sd,
                val,
                str,
                limit,
                isWolf: str.length > 20 // If the fraction is huge (e.g. crossing the ends of the 53 chain), mark it as wolf!
            }
        };
    });
}
