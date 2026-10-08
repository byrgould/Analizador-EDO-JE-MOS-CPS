import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { normalForm, primeForm, Tn, In, transposeSet, invertSet } from './set-theory.ts';

describe('set-theory (Forte / Rahn algorithms)', () => {
    test('normalForm orders and packs pitch classes', () => {
        // C major triad in 12-EDO: [0, 4, 7]
        assert.deepEqual(normalForm([0, 4, 7], 12), [0, 4, 7]);
        // Unordered and unnormalized: [7, 16, -8] -> [7, 4, 4] -> [4, 7]
        assert.deepEqual(normalForm([7, 16, -8], 12), [4, 7]);
    });

    test('primeForm resolves major and minor triads to Forte 3-11 [0, 3, 7]', () => {
        // Minor triad [0, 3, 7]
        assert.deepEqual(primeForm([0, 3, 7], 12), [0, 3, 7]);
        // Major triad [0, 4, 7] -> must invert to [0, 3, 7] because it is more left-packed
        assert.deepEqual(primeForm([0, 4, 7], 12), [0, 3, 7]);
    });

    test('primeForm resolves Forte 3-3 to [0, 1, 5]', () => {
        // [0, 4, 5] should resolve to [0, 1, 5]
        assert.deepEqual(primeForm([0, 4, 5], 12), [0, 1, 5]);
        assert.deepEqual(primeForm([0, 1, 5], 12), [0, 1, 5]);
    });

    test('primeForm resolves Forte 4-19 to [0, 1, 4, 8]', () => {
        assert.deepEqual(primeForm([0, 1, 4, 8], 12), [0, 1, 4, 8]);
        assert.deepEqual(primeForm([0, 4, 7, 8], 12), [0, 1, 4, 8]);
    });

    test('primeForm resolves Diatonic / Major scale (7-35) to [0, 1, 3, 5, 6, 8, 10]', () => {
        // C Major scale: C, D, E, F, G, A, B -> [0, 2, 4, 5, 7, 9, 11]
        assert.deepEqual(primeForm([0, 2, 4, 5, 7, 9, 11], 12), [0, 1, 3, 5, 6, 8, 10]);
    });

    test('primeForm resolves whole tone scale (6-35) to [0, 2, 4, 6, 8, 10]', () => {
        assert.deepEqual(primeForm([0, 2, 4, 6, 8, 10], 12), [0, 2, 4, 6, 8, 10]);
    });

    test('Tn and In operations work correctly', () => {
        // T2 of [0, 4, 7] -> [2, 6, 9]
        assert.deepEqual(Tn([0, 4, 7], 2, 12), [2, 6, 9]);
        // I0 of [0, 4, 7] -> [0, 8, 5] in normal form -> [5, 8, 0]
        assert.deepEqual(In([0, 4, 7], 0, 12), [5, 8, 0]);
    });

    test('transposeSet and invertSet handle boundaries', () => {
        assert.deepEqual(transposeSet([0, 11], 2, 12), [2, 1]);
        assert.deepEqual(invertSet([0, 1, 2], 0, 12), [0, 11, 10]);
    });
});
