import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

vi.mock('./api.js', () => ({
  fetchAnalyses: vi.fn().mockResolvedValue([]),
  fetchAnalysis: vi.fn(),
  createAnalysis: vi.fn()
}));

test('renders the dashboard title', async () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText('AI-Powered CI/CD Review Platform')).toBeInTheDocument();
  expect(await screen.findByText('No analyses yet. Submit a repository to create your first report.')).toBeInTheDocument();
});
