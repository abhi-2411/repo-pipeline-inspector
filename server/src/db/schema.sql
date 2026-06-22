CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY,
  repository_url TEXT NOT NULL,
  repository_name TEXT NOT NULL,
  status TEXT NOT NULL,
  score INTEGER NOT NULL,
  report_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
