import { UserButton } from '@clerk/clerk-react';
import { Menu, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="btn btn-ghost btn-sm md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Todo List</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Sparkles className="h-4 w-4 text-primary-500" />
          <span className="hidden sm:inline">AI Powered</span>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}
