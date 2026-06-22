import { useEffect, useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnalysisCard from '../components/AnalysisCard.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { createAnalysis, fetchAnalyses } from '../api.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  async function loadAnalyses() {
    setIsLoading(true);
    setError('');

    try {
      setAnalyses(await fetchAnalyses());
    } catch {
      setError('Could not load previous analyses. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAnalyses();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsAnalyzing(true);
    setError('');

    try {
      const report = await createAnalysis(repositoryUrl);
      navigate(`/analyses/${report.id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Analysis failed. Check the repository URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="min-h-screen bg-mist">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Portfolio CI/CD Review Tool</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">AI-Powered CI/CD Review Platform</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Submit a GitHub repository, run practical checks, and get a readable AI review for your dashboard.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <label htmlFor="repositoryUrl" className="text-sm font-semibold text-ink">
            GitHub repository URL
          </label>
          <input
            id="repositoryUrl"
            type="url"
            required
            value={repositoryUrl}
            onChange={(event) => setRepositoryUrl(event.target.value)}
            placeholder="https://github.com/user/repository"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
          <button
            type="submit"
            disabled={isAnalyzing}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze repository'}
          </button>
          {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </form>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-ink">Previous analyses</h2>
            <button
              type="button"
              onClick={loadAnalyses}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-teal"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <LoadingState label="Loading previous analyses..." />
          ) : analyses.length > 0 ? (
            <div className="grid gap-3">
              {analyses.map((analysis) => (
                <AnalysisCard key={analysis.id} analysis={analysis} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No analyses yet. Submit a repository to create your first report.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
