import dotenv from 'dotenv';

// Load variables from server/.env when running locally.
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  databaseFile: process.env.DATABASE_FILE || './data/app.sqlite'
};
