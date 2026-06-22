import fs from 'node:fs';
import { v4 as uuid } from 'uuid';
import { cloneRepository, createTempRepoPath, getRepositoryName } from '../utils/repository.js';
import { runCommand } from '../utils/commandRunner.js';
import { buildRepositoryReport, calculateScore, summarizeCommandResult } from './reportService.js';
import { generateAiReview } from './openaiService.js';
import { saveAnalysis } from '../db/database.js';

function getAvailableCommand(scripts, candidates) {
  return candidates.find((scriptName) => scripts?.[scriptName]);
}

export async function analyzeRepository(repositoryUrl) {
  const id = uuid();
  const repositoryName = getRepositoryName(repositoryUrl);
  const tempPath = createTempRepoPath(repositoryName);

  try {
    await cloneRepository(repositoryUrl, tempPath);

    const { qualityChecks } = buildRepositoryReport(tempPath);
    const scripts = qualityChecks.scripts;

    const lintScript = getAvailableCommand(scripts, ['lint']);
    const testScript = getAvailableCommand(scripts, ['test']);

    // Install dependencies only for Node projects, then run scripts if they exist.
    if (qualityChecks.hasPackageJson) {
      await runCommand('npm install', tempPath, 60000);
    }

    const lintCommandResult = lintScript ? await runCommand(`npm run ${lintScript}`, tempPath) : null;
    const testCommandResult = testScript ? await runCommand(`npm run ${testScript}`, tempPath) : null;

    const lint = summarizeCommandResult(lintCommandResult, 'No lint script found in package.json.');
    const tests = summarizeCommandResult(testCommandResult, 'No test script found in package.json.');
    const score = calculateScore({ qualityChecks, lintResult: lint, testResult: tests });

    const reportBase = {
      id,
      repositoryUrl,
      repositoryName,
      qualityChecks,
      lint,
      tests,
      score
    };

    const aiReview = await generateAiReview(reportBase);

    const report = {
      ...reportBase,
      aiReview,
      createdAt: new Date().toISOString()
    };

    saveAnalysis({
      id,
      repositoryUrl,
      repositoryName,
      status: 'completed',
      score,
      report,
      createdAt: report.createdAt
    });

    return report;
  } finally {
    // Remove the temporary clone after analysis completes.
    fs.rmSync(tempPath, { recursive: true, force: true });
  }
}
