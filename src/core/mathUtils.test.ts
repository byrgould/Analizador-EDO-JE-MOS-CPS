import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mod, gcd, sortNumbers, uniqueSorted, arraysEqual } from './mathUtils.ts';

describe('mathUtils', () => {
    test('mod computes positive modulo correctly', () => {
        assert.equal(mod(13, 12), 1);
        assert.equal(mod(-1, 12), 11);
        assert.equal(mod(-13, 12), 11);
        assert.equal(mod(0, 12), 0);
    });

    test('mod guards against division by zero', () => {
        assert.equal(mod(5, 0), 0);
    });

    test('gcd computes greatest common divisor correctly', () => {
        assert.equal(gcd(12, 18), 6);
        assert.equal(gcd(-12, 18), 6);
        assert.equal(gcd(0, 5), 5);
        assert.equal(gcd(5, 0), 5);
        assert.equal(gcd(0, 0), 0);
        assert.equal(gcd(17, 19), 1);
    });

    test('sortNumbers sorts numerically rather than lexicographically', () => {
        assert.deepEqual(sortNumbers([10, 2, 1, 20]), [1, 2, 10, 20]);
    });

    test('uniqueSorted removes duplicates and sorts', () => {
        assert.deepEqual(uniqueSorted([5, 1, 5, 3, 1, 9]), [1, 3, 5, 9]);
    });

    test('arraysEqual compares correctly', () => {
        assert.equal(arraysEqual([1, 2, 3], [1, 2, 3]), true);
        assert.equal(arraysEqual([1, 2], [1, 2, 3]), false);
        assert.equal(arraysEqual([1, 2, 4], [1, 2, 3]), false);
    });
});
