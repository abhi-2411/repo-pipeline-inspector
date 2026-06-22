import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';
import ScoreBadge from './ScoreBadge.jsx';

export default function AnalysisCard({ analysis }) {
  return (
    <Link
      to={`/analyses/${analysis.id}`}
      className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal hover:shadow-md sm:grid-cols-[1fr_auto]"
    >
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <GitBranch className="h-4 w-4" aria-hidden="true" />
          <span>{new Date(analysis.createdAt).toLocaleString()}</span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-ink">{analysis.repositoryName}</h2>
        <p className="mt-1 break-all text-sm text-slate-600">{analysis.repositoryUrl}</p>
      </div>
      <div className="flex items-start sm:justify-end">
        <ScoreBadge score={analysis.score} />
      </div>
    </Link>
  );
}
