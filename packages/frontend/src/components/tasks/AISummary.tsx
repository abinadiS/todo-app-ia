import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import type { TaskSummaryResponse } from '@todo/shared';

interface AISummaryProps {
  data?: TaskSummaryResponse;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
}

export function AISummary({ data, isLoading, error, onClose }: AISummaryProps) {
  return (
    <div className="mb-6 rounded-lg border border-primary-200 bg-primary-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h3 className="font-medium text-primary-900">AI Task Summary</h3>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-sm">
          <X className="h-4 w-4" />
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-primary-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Analyzing your tasks...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to generate summary. Please try again.</span>
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-2">
          <p className="text-primary-800">{data.summary}</p>
          <div className="flex gap-4 text-sm text-primary-600">
            <span>Pending tasks: {data.totalPending}</span>
            {data.estimatedTime && <span>Estimated time: {data.estimatedTime}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
