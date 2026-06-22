import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { env } from '../config/env.js';

const databasePath = path.resolve(env.databaseFile);
const schemaPath = path.resolve('src/db/schema.sql');

// Ensure the local data folder exists before SQLite opens the file.
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

export const db = new Database(databasePath);

// Apply the tiny schema at startup. This keeps local setup beginner friendly.
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

export function saveAnalysis(analysis) {
  const statement = db.prepare(`
    INSERT INTO analyses (
      id,
      repository_url,
      repository_name,
      status,
      score,
      report_json,
      created_at
    ) VALUES (
      @id,
      @repositoryUrl,
      @repositoryName,
      @status,
      @score,
      @reportJson,
      @createdAt
    )
  `);

  statement.run({
    ...analysis,
    reportJson: JSON.stringify(analysis.report)
  });
}

export function listAnalyses() {
  const rows = db.prepare(`
    SELECT id, repository_url, repository_name, status, score, created_at
    FROM analyses
    ORDER BY created_at DESC
  `).all();

  return rows.map((row) => ({
    id: row.id,
    repositoryUrl: row.repository_url,
    repositoryName: row.repository_name,
    status: row.status,
    score: row.score,
    createdAt: row.created_at
  }));
}

export function getAnalysisById(id) {
  const row = db.prepare('SELECT * FROM analyses WHERE id = ?').get(id);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    repositoryUrl: row.repository_url,
    repositoryName: row.repository_name,
    status: row.status,
    score: row.score,
    report: JSON.parse(row.report_json),
    createdAt: row.created_at
  };
}
