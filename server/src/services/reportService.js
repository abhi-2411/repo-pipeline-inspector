import fs from 'node:fs';
import path from 'node:path';
import { countFiles, readJsonFile } from '../utils/repository.js';

export function calculateScore({ qualityChecks, lintResult, testResult }) {
  let score = 50;

  score += qualityChecks.hasReadme ? 10 : -5;
  score += qualityChecks.hasPackageJson ? 10 : -5;
  score += qualityChecks.hasTestsFolder ? 10 : -5;
  score += qualityChecks.fileCount > 0 ? 5 : -10;

  if (lintResult.status === 'passed') score += 10;
  if (lintResult.status === 'failed') score -= 10;
  if (testResult.status === 'passed') score += 15;
  if (testResult.status === 'failed') score -= 15;

  return Math.max(0, Math.min(100, score));
}

export function buildRepositoryReport(repositoryPath) {
  const packageJson = readJsonFile(path.join(repositoryPath, 'package.json'));
  const files = fs.readdirSync(repositoryPath);

  // These lightweight checks work across many beginner repositories.
  const qualityChecks = {
    hasReadme: files.some((file) => file.toLowerCase().startsWith('readme')),
    hasPackageJson: Boolean(packageJson),
    hasTestsFolder: files.some((file) => ['test', 'tests', '__tests__'].includes(file.toLowerCase())),
    fileCount: countFiles(repositoryPath),
    scripts: packageJson?.scripts || {}
  };

  return {
    packageJson,
    qualityChecks
  };
}

export function summarizeCommandResult(result, skippedMessage) {
  if (!result) {
    return {
      status: 'skipped',
      command: null,
      summary: skippedMessage,
      output: ''
    };
  }

  return {
    status: result.success ? 'passed' : 'failed',
    command: result.command,
    summary: result.success ? 'Command completed successfully.' : 'Command failed. Check output for details.',
    output: [result.stdout, result.stderr].filter(Boolean).join('\n').slice(0, 4000)
  };
}
