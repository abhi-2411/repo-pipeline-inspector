import { exec } from 'node:child_process';

// Runs a shell command with a timeout so a broken project cannot hang forever.
export function runCommand(command, cwd, timeoutMs = 30000) {
  return new Promise((resolve) => {
    exec(command, { cwd, timeout: timeoutMs }, (error, stdout, stderr) => {
      resolve({
        command,
        success: !error,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: error?.code || 0
      });
    });
  });
}
