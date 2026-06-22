export default function ScoreBadge({ score }) {
  const colorClass = score >= 80
    ? 'bg-teal-100 text-teal-800'
    : score >= 60
      ? 'bg-amber-100 text-amber-800'
      : 'bg-red-100 text-red-800';

  return (
    <span className={`inline-flex min-w-16 items-center justify-center rounded-md px-3 py-1 text-sm font-semibold ${colorClass}`}>
      {score}/100
    </span>
  );
}
