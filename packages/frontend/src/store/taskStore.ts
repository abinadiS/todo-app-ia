import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TaskStatus } from '@todo/shared';

interface TaskState {
  // Filter state
  statusFilter: TaskStatus | 'ALL';
  searchQuery: string;

  // Selected task for editing
  selectedTaskId: string | null;

  // Form state
  isFormOpen: boolean;
  isEditMode: boolean;

  // Actions
  setStatusFilter: (status: TaskStatus | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  selectTask: (id: string | null) => void;
  openForm: (editMode?: boolean) => void;
  closeForm: () => void;
  openEditForm: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>()(
  devtools(
    (set) => ({
      statusFilter: 'ALL',
      searchQuery: '',
      selectedTaskId: null,
      isFormOpen: false,
      isEditMode: false,

      setStatusFilter: (status) => set({ statusFilter: status }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectTask: (id) => set({ selectedTaskId: id }),
      openForm: (editMode = false) => set({ isFormOpen: true, isEditMode: editMode }),
      closeForm: () => set({ isFormOpen: false, isEditMode: false, selectedTaskId: null }),
      openEditForm: (taskId) =>
        set({ isFormOpen: true, isEditMode: true, selectedTaskId: taskId }),
    }),
    { name: 'task-store' }
  )
);
