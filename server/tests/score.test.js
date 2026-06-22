import { describe, expect, it } from 'vitest';
import { calculateScore } from '../src/services/reportService.js';

describe('calculateScore', () => {
  it('rewards repositories with docs, linting, and passing tests', () => {
    const score = calculateScore({
      qualityChecks: {
        hasReadme: true,
        hasPackageJson: true,
        hasTestsFolder: true,
        fileCount: 20
      },
      lintResult: { status: 'passed' },
      testResult: { status: 'passed' }
    });

    expect(score).toBe(100);
  });

  it('keeps the score inside the 0 to 100 range', () => {
    const score = calculateScore({
      qualityChecks: {
        hasReadme: false,
        hasPackageJson: false,
        hasTestsFolder: false,
        fileCount: 0
      },
      lintResult: { status: 'failed' },
      testResult: { status: 'failed' }
    });

    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
