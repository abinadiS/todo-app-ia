import { useState } from 'react';
import { Check, Clock, Circle, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Task, TaskStatus } from '@todo/shared';
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks';
import { useTaskStore } from '../../store/taskStore';

interface TaskItemProps {
  task: Task;
}

const statusConfig: Record<TaskStatus, { icon: React.ReactNode; badge: string }> = {
  PENDING: {
    icon: <Circle className="h-4 w-4" />,
    badge: 'badge-pending',
  },
  IN_PROGRESS: {
    icon: <Clock className="h-4 w-4" />,
    badge: 'badge-in-progress',
  },
  COMPLETED: {
    icon: <Check className="h-4 w-4" />,
    badge: 'badge-completed',
  },
};

const priorityBadge: Record<string, string> = {
  LOW: 'badge-low',
  MEDIUM: 'badge-medium',
  HIGH: 'badge-high',
  URGENT: 'badge-urgent',
};

export function TaskItem({ task }: TaskItemProps) {
  const { openEditForm } = useTaskStore();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask.mutate({ id: task.id, data: { status: newStatus } });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTask.mutateAsync(task.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const config = statusConfig[task.status];

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-medium truncate ${
                task.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
            <span className={`badge ${config.badge}`}>
              {task.status.replace('_', ' ')}
            </span>
            {task.aiPriority && (
              <span className={`badge ${priorityBadge[task.aiPriority]}`}>
                {task.aiPriority}
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Quick status buttons */}
          {task.status !== 'COMPLETED' && (
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              className="btn btn-ghost btn-sm text-green-600 hover:bg-green-50"
              title="Mark as completed"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          {task.status === 'PENDING' && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className="btn btn-ghost btn-sm text-blue-600 hover:bg-blue-50"
              title="Start task"
            >
              <Clock className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => openEditForm(task.id)}
            className="btn btn-ghost btn-sm"
            title="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50"
            title="Delete task"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
