import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { AISummary } from './AISummary';
import { useTaskStore } from '../../store/taskStore';
import { useTaskSummary } from '../../hooks/useAI';
import { useState } from 'react';

export function TasksPage() {
  const { openForm, isFormOpen } = useTaskStore();
  const taskSummary = useTaskSummary();
  const [showSummary, setShowSummary] = useState(false);

  const handleGetSummary = async () => {
    setShowSummary(true);
    taskSummary.mutate();
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <div className="flex gap-2">
          <button
            onClick={handleGetSummary}
            disabled={taskSummary.isPending}
            className="btn btn-secondary btn-md flex items-center gap-2"
          >
            {taskSummary.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            AI Summary
          </button>
          <button
            onClick={() => openForm()}
            className="btn btn-primary btn-md flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>

      {/* AI Summary */}
      {showSummary && (
        <AISummary
          data={taskSummary.data}
          isLoading={taskSummary.isPending}
          error={taskSummary.error}
          onClose={() => setShowSummary(false)}
        />
      )}

      {/* Task List */}
      <TaskList />

      {/* Task Form Modal */}
      {isFormOpen && <TaskForm />}
    </div>
  );
}
