import express from 'express';
import { z } from 'zod';
import { analyzeRepository } from '../services/analysisService.js';
import { getAnalysisById, listAnalyses } from '../db/database.js';

export const analysesRouter = express.Router();

const createAnalysisSchema = z.object({
  repositoryUrl: z.string().url().refine((url) => url.includes('github.com'), {
    message: 'Please submit a valid GitHub repository URL.'
  })
});

analysesRouter.get('/', (_request, response) => {
  response.json(listAnalyses());
});

analysesRouter.get('/:id', (request, response) => {
  const analysis = getAnalysisById(request.params.id);

  if (!analysis) {
    return response.status(404).json({ message: 'Analysis not found.' });
  }

  return response.json(analysis);
});

analysesRouter.post('/', async (request, response, next) => {
  try {
    const { repositoryUrl } = createAnalysisSchema.parse(request.body);
    const report = await analyzeRepository(repositoryUrl);

    return response.status(201).json(report);
  } catch (error) {
    return next(error);
  }
});
