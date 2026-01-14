import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isAIPanelOpen: boolean;

  toggleSidebar: () => void;
  toggleAIPanel: () => void;
  closeSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isSidebarOpen: false,
      isAIPanelOpen: false,

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleAIPanel: () => set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),
    }),
    { name: 'ui-store' }
  )
);
