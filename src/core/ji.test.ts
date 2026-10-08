import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRatio, getPrimeLimit, simplifyRatio } from './ji.ts';

describe('ji (Just Intonation & Prime Limits)', () => {
    test('simplifyRatio reduces fractions', () => {
        assert.deepEqual(simplifyRatio([81, 80]), [81, 80]);
        assert.deepEqual(simplifyRatio([12, 8]), [3, 2]);
        assert.deepEqual(simplifyRatio([0, 5]), [0, 1]);
    });

    test('normalizeRatio normalizes to interval [1, 2)', () => {
        assert.deepEqual(normalizeRatio([3, 1]), [3, 2]);   // 3/1 -> 3/2
        assert.deepEqual(normalizeRatio([1, 4]), [1, 1]);   // 1/4 -> 2/4 -> 4/4 = 1/1
        assert.deepEqual(normalizeRatio([5, 4]), [5, 4]);   // 5/4 is already in [1, 2)
    });

    test('normalizeRatio guards against division by zero without infinite loop', () => {
        const res = normalizeRatio([5, 0]);
        assert.deepEqual(res, [0, 1]);
    });

    test('normalizeRatio guards against negative ratios without infinite loop', () => {
        const res = normalizeRatio([-3, 2]);
        assert.deepEqual(res, [3, 2]);
    });

    test('getPrimeLimit computes prime factors accurately', () => {
        assert.equal(getPrimeLimit(1), 1);
        assert.equal(getPrimeLimit(2), 2);
        assert.equal(getPrimeLimit(3), 3);
        assert.equal(getPrimeLimit(6), 3);
        assert.equal(getPrimeLimit(10), 5);
        assert.equal(getPrimeLimit(21), 7);
        assert.equal(getPrimeLimit(121), 11);
    });

    test('getPrimeLimit handles large numbers beyond 32-bit without bitwise truncation', () => {
        // 2 * (2^32 + 3) = 8589934606. If truncated by >>= 1, produces wrong result 3.
        const largeVal = 2 * (2 ** 32 + 3);
        const limit = getPrimeLimit(largeVal);
        assert.ok(limit > 2, 'Limit should be properly calculated for large numbers');
        assert.equal(getPrimeLimit(2 ** 34), 2);
    });
});
