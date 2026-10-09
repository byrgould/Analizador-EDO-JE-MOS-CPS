// ji.ts
import { gcd } from './mathUtils.ts';

export type Ratio = [number, number];

export const PARTCH_43: Ratio[] = [
    [1, 1], [81, 80], [33, 32], [21, 20], [16, 15], [12, 11], [11, 10], [10, 9],
    [9, 8], [8, 7], [7, 6], [32, 27], [6, 5], [11, 9], [5, 4], [14, 11],
    [9, 7], [21, 16], [4, 3], [27, 20], [11, 8], [7, 5], [10, 7], [16, 11],
    [40, 27], [3, 2], [32, 21], [14, 9], [11, 7], [8, 5], [18, 11], [5, 3],
    [27, 16], [12, 7], [7, 4], [16, 9], [9, 5], [20, 11], [11, 6], [15, 8],
    [40, 21], [64, 33], [160, 81]
];

export function simplifyRatio(ratio: Ratio): Ratio {
    const divisor = gcd(ratio[0], ratio[1]);
    return [ratio[0] / divisor, ratio[1] / divisor];
}

export function multiplyRatios(a: Ratio, b: Ratio): Ratio {
    return simplifyRatio([a[0] * b[0], a[1] * b[1]]);
}

export function divideRatios(a: Ratio, b: Ratio): Ratio {
    return simplifyRatio([a[0] * b[1], a[1] * b[0]]);
}

export function normalizeRatio(ratio: Ratio): Ratio {
    let [n, d] = simplifyRatio(ratio);
    if (n === 0 || d === 0) return [0, 1]; // Edge case: zero or division by zero
    
    // Work with absolute values to guarantee convergence
    n = Math.abs(n);
    d = Math.abs(d);
    
    while (n / d >= 2) {
        d *= 2;
    }
    while (n / d < 1) {
        n *= 2;
    }
    return simplifyRatio([n, d]);
}

export function getPrimeLimit(n: number): number {
    let maxPrime = 1;
    // Evitar negativos y decimales
    n = Math.abs(Math.round(n));
    if (n === 0 || n === 1) return 1;
    
    while (n % 2 === 0) {
        maxPrime = 2;
        n /= 2;
    }
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        while (n % i === 0) {
            maxPrime = i;
            n /= i;
        }
    }
    if (n > 2) {
        maxPrime = n;
    }
    return maxPrime;
}

export function getRatioLimit(ratio: Ratio): number {
    const [n, d] = simplifyRatio(ratio);
    return Math.max(getPrimeLimit(n), getPrimeLimit(d));
}

export interface IntervalInfo {
    index: number;
    original: Ratio;
    interval: Ratio;
    limit: number;
}

export function getIntervalsForDegree(scale: Ratio[], degree: number): IntervalInfo[] {
    const base = scale[degree];
    return scale.map((ratio, index) => {
        const interval = normalizeRatio(divideRatios(ratio, base));
        return {
            index,
            original: ratio,
            interval,
            limit: getRatioLimit(interval)
        };
    });
}

// Erv Wilson's D'Alessandro scale data
export const DALESSANDRO_FREQS: Ratio[] = [
    [256, 1], [2079, 8], [264, 1], [270, 1], [4455, 16], [2464, 9], [280, 1], [288, 1], [1155, 4], [297, 1], [896, 3], [1215, 4], [308, 1], [315, 1], [320, 1], [10395, 32], [330, 1], [336, 1], [3780, 11], [1024, 3], [693, 2], [352, 1], [360, 1], [1485, 4], [378, 1], [384, 1], [385, 1], [396, 1], [405, 1], [1232, 3], [420, 1], [432, 1], [3465, 8], [440, 1], [448, 1], [462, 1], [945, 2], [480, 1], [484, 1], [31185, 64], [495, 1], [504, 1]
];

export const DALESSANDRO_WILSON_DEGREES: number[] = [
    0, 0, 1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9, 10, 10, 11, 12, 13, 13, 13, 14, 15, 16, 17, 18, 18, 19, 20, 21, 22, 23, 23, 24, 25, 26, 27, 28, 28, 28, 29, 30
];

export const DALESSANDRO_TEXTS: string[] = [
    "∅", "3∙7∙9∙11", "3∙11", "3∙5∙9", "3²∙5∙9∙11", "7∙11/9", "5∙7", "9", "3∙5∙7∙11", "3∙9∙11", 
    "7/3", "9×3∙5∙9", "7∙11", "5∙7∙9", "5", "3∙5∙7∙9∙11", "3∙5∙11", "3∙7", "3∙5∙7∙9/11", "/3", 
    "7∙9∙11", "11", "5∙9", "3∙5∙9∙11", "3∙7∙9", "3", "5∙7∙11", "9∙11", "3²∙5∙9", "7∙11/3", 
    "3∙5∙7", "3∙9", "5∙7∙9∙11", "5∙11", "7", "3∙7∙11", "3∙5∙7∙9", "3∙5", "11²", "3²∙5∙7∙9∙11", 
    "5∙9∙11", "7∙9"
];

export const DALESSANDRO_IS_PIGTAIL: boolean[] = [
    false, false, false, false, true, true, false, false, false, false, 
    true, true, false, false, false, false, false, false, true, true, 
    false, false, false, false, false, false, false, false, true, true, 
    false, false, false, false, false, false, false, false, true, true, 
    false, false
];

export const DALESSANDRO_CPS_CATEGORIES: string[] = [
    "0)6 Monany", // 0
    "4)6 Pentadekany / 5)6 Hexany", // 1
    "2)6 Pentadekany / 3)6 Eikosany", // 2
    "3)6 Eikosany / 4)6 Pentadekany", // 3
    "Pigtail (Linear position +26)", // 4
    "Pigtail (Linear position +26)", // 5
    "2)6 Pentadekany / 3)6 Eikosany", // 6
    "1)6 Hexany / 2)6 Pentadekany", // 7
    "4)6 Pentadekany / 5)6 Hexany", // 8
    "3)6 Eikosany / 4)6 Pentadekany", // 9
    "Pigtail (Linear position +9)", // 10
    "Pigtail (Linear position +9)", // 11
    "2)6 Pentadekany / 3)6 Eikosany", // 12
    "3)6 Eikosany / 4)6 Pentadekany", // 13
    "1)6 Hexany / 2)6 Pentadekany", // 14
    "5)6 Hexany / 6)6 Monany", // 15
    "3)6 Eikosany / 4)6 Pentadekany", // 16
    "2)6 Pentadekany / 3)6 Eikosany", // 17
    "Pigtail (Linear position -1)", // 18
    "Pigtail (Linear position -1)", // 19
    "3)6 Eikosany / 4)6 Pentadekany", // 20
    "1)6 Hexany / 2)6 Pentadekany", // 21
    "2)6 Pentadekany / 3)6 Eikosany", // 22
    "4)6 Pentadekany / 5)6 Hexany", // 23
    "3)6 Eikosany / 4)6 Pentadekany", // 24
    "1)6 Hexany / 2)6 Pentadekany", // 25
    "3)6 Eikosany / 4)6 Pentadekany", // 26
    "2)6 Pentadekany / 3)6 Eikosany", // 27
    "Pigtail (1∙3∙7∙9∙11∙15 Eikosany)", // 28
    "Pigtail (1∙3∙7∙9∙11∙15 Eikosany)", // 29
    "3)6 Eikosany / 4)6 Pentadekany", // 30
    "2)6 Pentadekany / 3)6 Eikosany", // 31
    "4)6 Pentadekany / 5)6 Hexany", // 32
    "2)6 Pentadekany / 3)6 Eikosany", // 33
    "1)6 Hexany / 2)6 Pentadekany", // 34
    "3)6 Eikosany / 4)6 Pentadekany", // 35
    "4)6 Pentadekany / 5)6 Hexany", // 36
    "2)6 Pentadekany / 3)6 Eikosany", // 37
    "Pigtail (Linear position +36)", // 38
    "Pigtail (Linear position +36)", // 39
    "3)6 Eikosany / 4)6 Pentadekany", // 40
    "2)6 Pentadekany / 3)6 Eikosany"  // 41
];

// Calculated basic ratios derived from dividing the frequencies by the root (256)
export const DALESSANDRO_42: Ratio[] = DALESSANDRO_FREQS.map(freq => {
    return simplifyRatio([freq[0], freq[1] * 256]);
});

export const DALESSANDRO_NOTE_NAMES: string[] = [
    "C", // 0
    "C/ or B♯", // 1
    "C", // 2
    "C+", // 3
    "C♯", // 4
    "C♯", // 5
    "D♭", // 6
    "D", // 7
    "D/", // 8
    "D", // 9
    "D+", // 10
    "D+", // 11
    "D♯", // 12
    "E♭", // 13
    "E", // 14
    "E/", // 15
    "E", // 16
    "E+ or F♭", // 17
    "F", // 18
    "F", // 19
    "F/ or E♯", // 20
    "F", // 21
    "F+", // 22
    "F♯", // 23
    "G♭", // 24
    "G", // 25
    "G/", // 26
    "G", // 27
    "G+", // 28
    "G♯", // 29
    "A♭", // 30
    "A", // 31
    "A/", // 32
    "A", // 33
    "A+", // 34
    "A♯", // 35
    "B♭", // 36
    "B", // 37
    "B/", // 38
    "B/", // 39
    "B", // 40
    "B+ or C♭" // 41
];
