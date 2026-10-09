// mathUtils.ts

/**
 * Operación módulo segura.
 * El operador '%' en JavaScript puede devolver valores negativos.
 * Esta función garantiza un resultado positivo.
 */
export function mod(n: number, m: number): number {
    if (m === 0) return 0;
    return ((n % m) + m) % m;
}

/**
 * Ordena un arreglo de números de forma ascendente.
 * (En JavaScript nativo, .sort() convierte a string primero, lo cual rompe los números).
 */
export function sortNumbers(arr: number[]): number[] {
    return [...arr].sort((a, b) => a - b);
}

/**
 * Remueve duplicados y ordena un arreglo de números.
 */
export function uniqueSorted(arr: number[]): number[] {
    return sortNumbers([...new Set(arr)]);
}

/**
 * Compara dos arreglos numéricos si son idénticos.
 */
export function arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

/**
 * Calcula el máximo común divisor de dos números.
 */
export function gcd(a: number, b: number): number {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
