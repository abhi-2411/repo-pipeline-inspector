import OpenAI from 'openai';
import { env } from '../config/env.js';

function fallbackReview(report) {
  return {
    summary: `Local fallback review for ${report.repositoryName}. Add OPENAI_API_KEY to generate a live AI review.`,
    strengths: [
      report.qualityChecks.hasReadme ? 'Includes a README file.' : 'The project can still be analyzed without a README.',
      report.lint.status === 'passed' ? 'Linting passed successfully.' : 'The analysis pipeline handles lint results clearly.',
      report.tests.status === 'passed' ? 'Tests passed successfully.' : 'The project structure is simple enough to improve iteratively.'
    ],
    weaknesses: [
      report.qualityChecks.hasReadme ? 'README quality still depends on its content depth.' : 'Missing README makes the project harder to understand.',
      report.tests.status === 'skipped' ? 'No test script was found.' : 'Test coverage was not measured in detail.',
      report.lint.status === 'skipped' ? 'No lint script was found.' : 'Lint output should be reviewed for maintainability trends.'
    ],
    improvements: [
      'Add or improve README setup instructions.',
      'Add meaningful tests for important user flows.',
      'Keep linting enabled in CI so issues are caught early.'
    ]
  };
}

export async function generateAiReview(report) {
  if (!env.openAiApiKey) {
    return fallbackReview(report);
  }

  const client = new OpenAI({ apiKey: env.openAiApiKey });

  const prompt = `
You are reviewing a student portfolio repository.
Return JSON with summary, strengths, weaknesses, and improvements.
Keep the language supportive, specific, and practical.

Repository report:
${JSON.stringify(report, null, 2)}
`;

  const response = await client.chat.completions.create({
    model: env.openAiModel,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}
