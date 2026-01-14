import { Loader2 } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { useTasks } from '../../hooks/useTasks';
import { useTaskStore } from '../../store/taskStore';

export function TaskList() {
  const { statusFilter } = useTaskStore();
  const { data, isLoading, error } = useTasks(statusFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-red-800">Failed to load tasks. Please try again.</p>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.data.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}

      {/* Pagination info */}
      <div className="text-center text-sm text-gray-500">
        Showing {data.data.length} of {data.meta.total} tasks
      </div>
    </div>
  );
}
