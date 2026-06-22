import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Loading analysis...' }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
      <Loader2 className="h-5 w-5 animate-spin text-teal" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
