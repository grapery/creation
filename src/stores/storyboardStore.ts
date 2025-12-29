import { create } from 'zustand';
import { storyboardApi } from '../lib/api';

export interface Storyboard {
  id: string;
  title: string;
  content?: string;
  rawInput?: string;
  storyId: string;
  parentId?: string | null;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  likes: number;
  views: number;
  scenes?: Array<{
    id?: string;
    title: string;
    description?: string;
    image?: string;
    location?: string;
    timeOfDay?: string;
  }>;
  characterRefs?: any[];
  sceneRefs?: any[];
  createdAt: string;
  updatedAt: string;
}

interface StoryboardState {
  storyboards: Storyboard[];
  feed: Storyboard[];
  currentStoryboard: Storyboard | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  
  // Actions
  fetchStoryboards: (page?: number, limit?: number) => Promise<void>;
  fetchFeed: (page?: number, limit?: number) => Promise<void>;
  fetchStoryboard: (id: string) => Promise<void>;
  fetchStoryboardTree: (id: string) => Promise<void>;
  fetchStoryboardChildren: (id: string) => Promise<void>;
  createStoryboard: (data: any) => Promise<Storyboard>;
  updateStoryboard: (id: string, data: any) => Promise<void>;
  deleteStoryboard: (id: string) => Promise<void>;
  forkStoryboard: (id: string, data?: any) => Promise<Storyboard>;
  likeStoryboard: (id: string) => Promise<void>;
  unlikeStoryboard: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useStoryboardStore = create<StoryboardState>((set, get) => ({
  storyboards: [],
  feed: [],
  currentStoryboard: null,
  isLoading: false,
  error: null,
  total: 0,

  fetchStoryboards: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyboardApi.listStoryboards(page, limit);
      const data = response.data;
      const storyboards = data.storyboards || data.data?.storyboards || data.data || [];
      const total = data.total || data.count || storyboards.length;
      
      set({
        storyboards: page === 1 ? storyboards : [...get().storyboards, ...storyboards],
        total,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch storyboards',
      });
    }
  },

  fetchFeed: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      // Use feed endpoint if available, otherwise use listStoryboards
      const response = await storyboardApi.listStoryboards(page, limit);
      const data = response.data;
      const storyboards = data.storyboards || data.data?.storyboards || data.data || [];
      const total = data.total || data.count || storyboards.length;
      
      set({
        feed: page === 1 ? storyboards : [...get().feed, ...storyboards],
        total,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch feed',
      });
    }
  },

  fetchStoryboard: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyboardApi.getStoryboard(id);
      const storyboard = response.data.storyboard || response.data;
      
      set({
        currentStoryboard: storyboard,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch storyboard',
      });
    }
  },

  fetchStoryboardTree: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyboardApi.getStoryboardTree(id);
      const storyboard = response.data.storyboard || response.data;
      
      set({
        currentStoryboard: storyboard,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch storyboard tree',
      });
    }
  },

  fetchStoryboardChildren: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyboardApi.getStoryboardChildren(id);
      const data = response.data;
      const children = data.children || data.data?.children || data.data || [];
      
      set({
        isLoading: false,
        error: null,
      });
      
      return children;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch children',
      });
      throw error;
    }
  },

  createStoryboard: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyboardApi.createStoryboard(data);
      const storyboard = response.data.storyboard || response.data;
      
      set((state) => ({
        storyboards: [storyboard, ...state.storyboards],
        currentStoryboard: storyboard,
        isLoading: false,
        error: null,
      }));
      
      return storyboard;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to create storyboard',
      });
      throw error;
    }
  },

  updateStoryboard: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyboardApi.updateStoryboard(id, data);
      const updatedStoryboard = response.data.storyboard || response.data;
      
      set((state) => ({
        storyboards: state.storyboards.map((s) => (s.id === id ? updatedStoryboard : s)),
        currentStoryboard: state.currentStoryboard?.id === id ? updatedStoryboard : state.currentStoryboard,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to update storyboard',
      });
      throw error;
    }
  },

  deleteStoryboard: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await storyboardApi.deleteStoryboard(id);
      
      set((state) => ({
        storyboards: state.storyboards.filter((s) => s.id !== id),
        currentStoryboard: state.currentStoryboard?.id === id ? null : state.currentStoryboard,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to delete storyboard',
      });
      throw error;
    }
  },

  forkStoryboard: async (id: string, data = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyboardApi.forkStoryboard(id, data);
      const storyboard = response.data.storyboard || response.data;
      
      set((state) => ({
        storyboards: [storyboard, ...state.storyboards],
        isLoading: false,
        error: null,
      }));
      
      return storyboard;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fork storyboard',
      });
      throw error;
    }
  },

  likeStoryboard: async (id: string) => {
    try {
      await storyboardApi.likeStoryboard(id);
      set((state) => ({
        storyboards: state.storyboards.map((s) =>
          s.id === id ? { ...s, likes: s.likes + 1 } : s
        ),
        currentStoryboard:
          state.currentStoryboard?.id === id
            ? { ...state.currentStoryboard, likes: state.currentStoryboard.likes + 1 }
            : state.currentStoryboard,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to like storyboard',
      });
    }
  },

  unlikeStoryboard: async (id: string) => {
    try {
      await storyboardApi.unlikeStoryboard(id);
      set((state) => ({
        storyboards: state.storyboards.map((s) =>
          s.id === id ? { ...s, likes: Math.max(0, s.likes - 1) } : s
        ),
        currentStoryboard:
          state.currentStoryboard?.id === id
            ? { ...state.currentStoryboard, likes: Math.max(0, state.currentStoryboard.likes - 1) }
            : state.currentStoryboard,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to unlike storyboard',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

