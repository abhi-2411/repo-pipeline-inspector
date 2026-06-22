import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import simpleGit from 'simple-git';

export function getRepositoryName(repositoryUrl) {
  const withoutTrailingSlash = repositoryUrl.replace(/\/$/, '');
  const lastPart = withoutTrailingSlash.split('/').pop() || 'repository';
  return lastPart.replace(/\.git$/, '');
}

export function createTempRepoPath(repositoryName) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `${repositoryName}-`));
}

export async function cloneRepository(repositoryUrl, destinationPath) {
  // Clone only the latest history to keep local analysis fast.
  await simpleGit().clone(repositoryUrl, destinationPath, ['--depth', '1']);
}

export function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function countFiles(directoryPath) {
  let total = 0;

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist', 'build'].includes(entry.name)) {
      continue;
    }

    const fullPath = path.join(directoryPath, entry.name);
    total += entry.isDirectory() ? countFiles(fullPath) : 1;
  }

  return total;
}
