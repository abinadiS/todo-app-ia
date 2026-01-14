import { useState, useEffect } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useCreateTask, useUpdateTask, useTask } from '../../hooks/useTasks';
import { useCompleteDescription } from '../../hooks/useAI';
import type { TaskStatus } from '@todo/shared';

export function TaskForm() {
  const { isEditMode, selectedTaskId, closeForm } = useTaskStore();
  const { data: existingTask } = useTask(selectedTaskId || '');
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const completeDescription = useCompleteDescription();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('PENDING');

  // Load existing task data when editing
  useEffect(() => {
    if (isEditMode && existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setStatus(existingTask.status);
    }
  }, [isEditMode, existingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      if (isEditMode && selectedTaskId) {
        await updateTask.mutateAsync({
          id: selectedTaskId,
          data: { title, description: description || undefined, status },
        });
      } else {
        await createTask.mutateAsync({
          title,
          description: description || undefined,
          status,
        });
      }
      closeForm();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleAIComplete = async () => {
    if (!title.trim()) return;

    try {
      const result = await completeDescription.mutateAsync(title);
      setDescription(result.description);
    } catch (error) {
      console.error('Failed to complete description:', error);
    }
  };

  const isLoading = createTask.isPending || updateTask.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={closeForm} className="btn btn-ghost btn-sm">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <button
                type="button"
                onClick={handleAIComplete}
                disabled={!title.trim() || completeDescription.isPending}
                className="btn btn-ghost btn-sm flex items-center gap-1 text-primary-600"
              >
                {completeDescription.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                AI Complete
              </button>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>

          {isEditMode && (
            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="input"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={closeForm} className="btn btn-secondary btn-md">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="btn btn-primary btn-md flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
