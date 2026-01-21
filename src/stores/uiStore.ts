import { create } from 'zustand';

interface UIState {
    isCreateGroupDialogOpen: boolean;
    setCreateGroupDialogOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isCreateGroupDialogOpen: false,
    setCreateGroupDialogOpen: (open: boolean) => set({ isCreateGroupDialogOpen: open }),
}));
