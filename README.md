# AI-Powered CI/CD Review Platform

A simple full-stack portfolio project where a developer submits a GitHub repository URL and receives a lightweight CI-style analysis plus an AI-powered code review summary.

The project is intentionally student-friendly: one React app, one Express API, SQLite for local storage, no Docker, no authentication, and no cloud services required.

## Reference Images
<img width="2447" height="1435" alt="image" src="https://github.com/user-attachments/assets/9b0b622b-305b-4e82-9160-ba2b6ceba56d" />
<img width="2442" height="287" alt="image" src="https://github.com/user-attachments/assets/8e0b24f6-fadd-408d-939d-23c99548be43" />

## Folder Structure

```text
ai-powered-cicd-review-platform/
  .github/
    workflows/
      ci.yml
  client/
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
    src/
      App.jsx
      main.jsx
      api.js
      index.css
      components/
        AnalysisCard.jsx
        LoadingState.jsx
        ScoreBadge.jsx
      pages/
        Dashboard.jsx
        AnalysisPage.jsx
  server/
    package.json
    .env.example
    src/
      app.js
      server.js
      config/
        env.js
      db/
        database.js
        schema.sql
      routes/
        analyses.js
      services/
        analysisService.js
        openaiService.js
        reportService.js
      utils/
        commandRunner.js
        repository.js
    tests/
      score.test.js
  sample-data/
    sample-report.json
```

## Features

- Submit a GitHub repository URL from a web dashboard.
- Clone the repository locally for analysis.
- Run basic quality checks, lint commands, and test commands when available.
- Generate a code quality score.
- Generate an AI-powered review with strengths, weaknesses, and suggested improvements.
- Save previous analyses in SQLite.
- Run linting, tests, and builds with GitHub Actions.

## Requirements

- Node.js 18 or newer
- npm
- Git installed locally
- Optional: an OpenAI API key for real AI reviews

## Installation

Install root dependencies and app dependencies:

```bash
npm install
npm run install:all
```

Create your backend environment file:

```bash
cp server/.env.example server/.env
```

On Windows PowerShell, use:

```powershell
Copy-Item server/.env.example server/.env
```

## Environment Variables

Edit `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DATABASE_FILE=./data/app.sqlite
```

`OPENAI_API_KEY` is optional. If it is missing, the backend returns a helpful mock AI review so the project still runs locally.

## Run Locally

From the project root:

```bash
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:5000
```

## API Endpoints

```http
GET /api/health
GET /api/analyses
GET /api/analyses/:id
POST /api/analyses
```

Example request:

```json
{
  "repositoryUrl": "https://github.com/octocat/Hello-World"
}
```

## How Analysis Works

1. The backend clones the submitted repository into a temporary folder.
2. It detects repository metadata and package scripts.
3. It runs simple quality checks, such as README/package detection and file counts.
4. It runs linting if a lint script exists.
5. It runs tests if a test script exists.
6. It calculates a practical score from the checks.
7. It sends a compact summary to OpenAI or uses a local fallback review.
8. It stores and returns the full report.

## GitHub Actions

The workflow in `.github/workflows/ci.yml` runs on push and pull requests. It installs dependencies, lints, tests, builds the backend, and builds the frontend.

## Notes for Portfolio Use

This project is designed to be understandable during interviews. Good next improvements would be adding repository branch selection, richer language detection, background jobs for long analyses, or user accounts.
