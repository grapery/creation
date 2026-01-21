import { create } from 'zustand';
import type { Story, GenericResponse } from '../types';
import { apiClient } from '../lib/api';

interface StoryStore {
    stories: Story[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;

    // Actions
    fetchFeed: (filter?: string, page?: number) => Promise<void>;
    likeStory: (storyId: string) => Promise<void>;
    unlikeStory: (storyId: string) => Promise<void>;

    // Helpers
    getStoryById: (id: string) => Story | undefined;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
    stories: [],
    isLoading: false,
    error: null,
    hasMore: true,
    page: 1,

    fetchFeed: async (filter = 'best', page = 1) => {
        set({ isLoading: true, error: null });
        try {
            const limit = 20;
            const offset = (page - 1) * limit;

            // Check if user is authenticated
            const token = localStorage.getItem('token');

            let response;
            if (token) {
                // Authenticated: use standard endpoint
                response = await apiClient.get<GenericResponse<{ stories: Story[], total: number }>>('/stories', {
                    params: {
                        limit,
                        offset,
                        ...(filter !== 'best' ? { sort: filter } : {})
                    }
                });
            } else {
                // Guest: use public trending endpoint
                response = await apiClient.get<GenericResponse<Story[]>>('/public/stories/trending', {
                    params: { limit }
                });
            }

            const data = response.data.data;
            // Handle different response structures
            const newStories = Array.isArray(data) ? data : (data.stories || []);

            set(state => ({
                stories: page === 1 ? newStories : [...state.stories, ...newStories],
                hasMore: newStories.length === limit,
                page,
                isLoading: false
            }));
        } catch (error: any) {
            console.error('Failed to fetch stories:', error);
            // Don't show error for 401, just set empty state
            if (error.response?.status === 401) {
                set({ stories: [], isLoading: false, hasMore: false });
            } else {
                set({ error: 'Failed to load stories', isLoading: false });
            }
        }
    },

    likeStory: async (storyId) => {
        // Optimistic update
        set(state => ({
            stories: state.stories.map(s =>
                s.id === storyId
                    ? { ...s, likes: s.likes + 1 } // Backend doesn't return 'isLiked' on list usually, depends on 'isFollowing' etc.
                    : s
            )
        }));

        try {
            await apiClient.post(`/stories/${storyId}/like`);
        } catch (error) {
            // Revert if failed
            set(state => ({
                stories: state.stories.map(s =>
                    s.id === storyId
                        ? { ...s, likes: s.likes - 1 }
                        : s
                )
            }));
        }
    },

    unlikeStory: async (storyId) => {
        // Optimistic update
        set(state => ({
            stories: state.stories.map(s =>
                s.id === storyId
                    ? { ...s, likes: s.likes - 1 }
                    : s
            )
        }));

        try {
            await apiClient.delete(`/stories/${storyId}/like`);
        } catch (error) {
            // Revert if failed
            set(state => ({
                stories: state.stories.map(s =>
                    s.id === storyId
                        ? { ...s, likes: s.likes + 1 }
                        : s
                )
            }));
        }
    },

    getStoryById: (id) => get().stories.find(s => s.id === id),
}));
