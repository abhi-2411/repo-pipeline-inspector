import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { analysesRouter } from './routes/analyses.js';

export const app = express();

// Allow the Vite frontend to call the local API.
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'AI-Powered CI/CD Review Platform API' });
});

app.use('/api/analyses', analysesRouter);

// Central error handler keeps route code small and responses consistent.
app.use((error, _request, response, _next) => {
  console.error(error);

  const status = error.name === 'ZodError' ? 400 : 500;
  const message = error.name === 'ZodError'
    ? error.errors[0].message
    : 'Something went wrong while analyzing the repository.';

  response.status(status).json({ message });
});
