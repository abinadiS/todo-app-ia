import { CheckCircle2, Circle, Clock, ListTodo, X } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import type { TaskStatus } from '@todo/shared';

const filters: { label: string; value: TaskStatus | 'ALL'; icon: React.ReactNode }[] = [
  { label: 'All Tasks', value: 'ALL', icon: <ListTodo className="h-4 w-4" /> },
  { label: 'Pending', value: 'PENDING', icon: <Circle className="h-4 w-4" /> },
  { label: 'In Progress', value: 'IN_PROGRESS', icon: <Clock className="h-4 w-4" /> },
  { label: 'Completed', value: 'COMPLETED', icon: <CheckCircle2 className="h-4 w-4" /> },
];

export function Sidebar() {
  const { statusFilter, setStatusFilter } = useTaskStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:relative md:z-0 md:translate-x-0 md:shadow-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <span className="text-lg font-semibold text-gray-900">Filters</span>
          <button
            onClick={toggleSidebar}
            className="btn btn-ghost btn-sm md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {filters.map((filter) => (
              <li key={filter.value}>
                <button
                  onClick={() => {
                    setStatusFilter(filter.value);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    statusFilter === filter.value
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
