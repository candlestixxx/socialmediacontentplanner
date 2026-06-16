import { create } from 'zustand';

interface Workspace {
  id: string;
  name: string;
}

interface AppState {
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  setActiveWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  clearState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeWorkspace: null,
  workspaces: [],
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  setWorkspaces: (workspaces) => set({ workspaces, activeWorkspace: workspaces[0] || null }),
  clearState: () => set({ activeWorkspace: null, workspaces: [] }),
}));
