import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CircleAlert, CircleMinus } from 'lucide-react';
import LoadingState from '../components/LoadingState.jsx';
import ScoreBadge from '../components/ScoreBadge.jsx';
import { fetchAnalysis } from '../api.js';

function StatusRow({ title, result }) {
  const Icon = result.status === 'passed'
    ? CheckCircle2
    : result.status === 'failed'
      ? CircleAlert
      : CircleMinus;

  const color = result.status === 'passed'
    ? 'text-teal'
    : result.status === 'failed'
      ? 'text-red-600'
      : 'text-slate-500';

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <h3 className="font-semibold text-ink">{title}</h3>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-600">
          {result.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{result.summary}</p>
      {result.command && <p className="mt-2 font-mono text-xs text-slate-500">{result.command}</p>}
      {result.output && (
        <pre className="mt-3 max-h-52 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
          {result.output}
        </pre>
      )}
    </div>
  );
}

function ReviewList({ title, items }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <h3 className="font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-mist px-3 py-2">{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalysisPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setAnalysis(await fetchAnalysis(id));
      } catch {
        setError('Could not load this analysis.');
      }
    }

    loadAnalysis();
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen bg-mist p-6">
        <p className="rounded-md bg-red-50 px-4 py-3 text-red-700">{error}</p>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-screen bg-mist p-6">
        <LoadingState />
      </main>
    );
  }

  const report = analysis.report;

  return (
    <main className="min-h-screen bg-mist">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:text-teal-700">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink">{analysis.repositoryName}</h1>
              <p className="mt-2 break-all text-sm text-slate-600">{analysis.repositoryUrl}</p>
              <p className="mt-1 text-sm text-slate-500">{new Date(analysis.createdAt).toLocaleString()}</p>
            </div>
            <ScoreBadge score={analysis.score} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Files scanned</p>
            <p className="mt-2 text-2xl font-bold text-ink">{report.qualityChecks.fileCount}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">README</p>
            <p className="mt-2 text-2xl font-bold text-ink">{report.qualityChecks.hasReadme ? 'Found' : 'Missing'}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Tests folder</p>
            <p className="mt-2 text-2xl font-bold text-ink">{report.qualityChecks.hasTestsFolder ? 'Found' : 'Missing'}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <StatusRow title="Lint results" result={report.lint} />
          <StatusRow title="Test results" result={report.tests} />
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">AI review summary</h2>
          <p className="mt-3 text-slate-700">{report.aiReview.summary}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <ReviewList title="Strengths" items={report.aiReview.strengths || []} />
          <ReviewList title="Weaknesses" items={report.aiReview.weaknesses || []} />
          <ReviewList title="Suggested improvements" items={report.aiReview.improvements || []} />
        </div>
      </section>
    </main>
  );
}
