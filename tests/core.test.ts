import { describe, it, expect } from 'vitest';
import { isMOS, generateAllMOS, stepsToSet, setToSteps } from './src/core/mos';
import { analyzeSet } from './src/core/analyzer';
import { normalizeRatio, divideRatios, getPrimeLimit } from './src/core/ji';

describe('MOS & EDO Analysis Core', () => {
  it('identifies Major Diatonic (7/12) as a valid MOS', () => {
    // Escala mayor en 12-EDO: [0, 2, 4, 5, 7, 9, 11]
    const majorScale = [0, 2, 4, 5, 7, 9, 11];
    const res = isMOS(majorScale, 12);
    expect(res.isMOS).toBe(true);
    expect(res.smallStep).toBe(1);
    expect(res.largeStep).toBe(2);
    expect(res.generator).toBeDefined();
  });

  it('rejects chromatic or whole tone scales as classical MOS', () => {
    // Escala de tonos enteros: [0, 2, 4, 6, 8, 10] en 12-EDO
    const wholeTone = [0, 2, 4, 6, 8, 10];
    const res = isMOS(wholeTone, 12);
    expect(res.isMOS).toBe(false);
  });

  it('correctly converts between steps and set in 12-EDO', () => {
    const steps = [2, 2, 1, 2, 2, 2, 1];
    const set = stepsToSet(steps, 0, 12);
    expect(set).toEqual([0, 2, 4, 5, 7, 9, 11]);
    const derivedSteps = setToSteps(set, 12);
    expect(derivedSteps).toEqual(steps);
  });

  it('generates primary MOS for 12-EDO with generator 7', () => {
    const mosList = generateAllMOS(12, 7);
    const sizes = mosList.map(m => m.numNotes);
    // Para 12-EDO gen 7: pentatónica (5), diatónica (7)
    expect(sizes).toContain(5);
    expect(sizes).toContain(7);
  });
});

describe('JI and Ratio Calculations', () => {
  it('normalizes ratios into octave range [1, 2)', () => {
    expect(normalizeRatio([3, 1])).toEqual([3, 2]);
    expect(normalizeRatio([1, 3])).toEqual([4, 3]);
    expect(normalizeRatio([4, 1])).toEqual([1, 1]);
  });

  it('divides ratios and calculates prime limits correctly', () => {
    // (3/2) / (5/4) = 6/5
    const div = divideRatios([3, 2], [5, 4]);
    expect(div).toEqual([6, 5]);
    expect(getPrimeLimit(6)).toBe(3);
    expect(getPrimeLimit(5)).toBe(5);
    expect(getPrimeLimit(11)).toBe(11);
  });
});

describe('Pitch Class Set Analysis', () => {
  it('calculates Prime Form for Major Triad [0, 4, 7] in 12-EDO', () => {
    const res = analyzeSet([0, 4, 7], 12);
    expect(res.primeForm).toEqual([0, 3, 7]);
    expect(res.intervalClassVector).toEqual([0, 0, 1, 1, 1, 0]);
  });
});
