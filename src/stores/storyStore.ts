import { create } from 'zustand';
import { storyApi, userApi } from '../lib/api';

export interface Story {
  id: string;
  title: string;
  content: string;
  description?: string;
  cover?: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  likes: number;
  views: number;
  comments: number;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  characters?: any[];
  scenes?: any[];
}

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  
  // Actions
  fetchStories: (page?: number, limit?: number, sortBy?: string) => Promise<void>;
  fetchStory: (id: string) => Promise<void>;
  createStory: (data: Partial<Story>) => Promise<Story>;
  updateStory: (id: string, data: Partial<Story>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;
  likeStory: (id: string) => Promise<void>;
  unlikeStory: (id: string) => Promise<void>;
  getUserStories: (userId: string, page?: number, limit?: number) => Promise<void>;
  clearError: () => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  currentStory: null,
  isLoading: false,
  error: null,
  total: 0,

  fetchStories: async (page = 1, limit = 20, sortBy = 'created_at') => {
    set({ isLoading: true, error: null });
    try {
      const offset = (page - 1) * limit;
      const response = await storyApi.listStories(page, limit);
      const data = response.data;
      
      // Handle different response formats
      const stories = data.stories || data.data?.stories || data.data || [];
      const total = data.total || data.count || stories.length;
      
      set({
        stories: page === 1 ? stories : [...get().stories, ...stories],
        total,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch stories',
      });
    }
  },

  fetchStory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyApi.getStory(id);
      const story = response.data.story || response.data;
      
      set({
        currentStory: story,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch story',
      });
    }
  },

  createStory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyApi.createStory(data);
      const story = response.data.story || response.data;
      
      set((state) => ({
        stories: [story, ...state.stories],
        currentStory: story,
        isLoading: false,
        error: null,
      }));
      
      return story;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to create story',
      });
      throw error;
    }
  },

  updateStory: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await storyApi.updateStory(id, data);
      const updatedStory = response.data.story || response.data;
      
      set((state) => ({
        stories: state.stories.map((s) => (s.id === id ? updatedStory : s)),
        currentStory: state.currentStory?.id === id ? updatedStory : state.currentStory,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to update story',
      });
      throw error;
    }
  },

  deleteStory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await storyApi.deleteStory(id);
      
      set((state) => ({
        stories: state.stories.filter((s) => s.id !== id),
        currentStory: state.currentStory?.id === id ? null : state.currentStory,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to delete story',
      });
      throw error;
    }
  },

  likeStory: async (id: string) => {
    try {
      await storyApi.likeStory(id);
      set((state) => ({
        stories: state.stories.map((s) =>
          s.id === id ? { ...s, likes: s.likes + 1 } : s
        ),
        currentStory:
          state.currentStory?.id === id
            ? { ...state.currentStory, likes: state.currentStory.likes + 1 }
            : state.currentStory,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to like story',
      });
    }
  },

  unlikeStory: async (id: string) => {
    try {
      await storyApi.unlikeStory(id);
      set((state) => ({
        stories: state.stories.map((s) =>
          s.id === id ? { ...s, likes: Math.max(0, s.likes - 1) } : s
        ),
        currentStory:
          state.currentStory?.id === id
            ? { ...state.currentStory, likes: Math.max(0, state.currentStory.likes - 1) }
            : state.currentStory,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to unlike story',
      });
    }
  },

  getUserStories: async (userId: string, page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userApi.getUserStories(userId, page, limit);
      const data = response.data;
      const stories = data.stories || data.data?.stories || data.data || [];
      
      set({
        stories: page === 1 ? stories : [...get().stories, ...stories],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch user stories',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

