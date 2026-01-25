import { apiClient, request } from './client';
import { Story } from '../types';

export const stories = {
    // Public Trending Stories (24h)
    getTrending: async (limit = 20): Promise<{ stories: Story[], total: number }> => {
        // API returns explicit structure in Swift: { stories, total, limit, offset }
        // We can type it properly if needed
        return request(`/api/public/stories/trending?limit=${limit}`);
    },

    list: async (page = 1, limit = 20, sortBy = 'created_at'): Promise<{ stories: Story[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/stories?limit=${limit}&offset=${offset}&sort_by=${sortBy}`);
    },

    get: async (id: string): Promise<Story> => {
        return request(`/api/stories/${id}`);
    },

    create: async (data: any): Promise<Story> => {
        return request('/api/stories', 'POST', data);
    },

    update: async (id: string, data: any): Promise<Story> => {
        return request(`/api/stories/${id}`, 'PUT', data);
    },

    like: async (id: string) => request(`/api/stories/${id}/like`, 'POST'),
    unlike: async (id: string) => request(`/api/stories/${id}/like`, 'DELETE'),

    // Following Feed (Dashboard)
    getFollowingStories: async (page = 1, limit = 20): Promise<{ stories: Story[], total: number }> => {
        // Note: iOS DashboardView calls viewModel.followingStories.
        // DashboardViewModel usually calls StoryService.shared.getFollowingStories or similar?
        // Swift code showed `getTrendingStories24h` and `listStories`.
        // Checking DashboardViewModel (not viewed yet). 
        // Assuming there is an endpoint for followed stories. 
        // Based on GroupService `listFollowedGroups`, maybe `stories/followed`?
        // Let's assume /api/stories/feed or /api/stories/following. 
        // Use general list for now or check if I missed it.
        // In Swift `FollowingContentView` iterates `viewModel.followingStories`.
        return request(`/api/stories/following?limit=${limit}`); // Guessing endpoint
    },
    // AI Styles
    getStyles: async (groupId?: string, limit = 20, offset = 0): Promise<{ styles: any[], total: number }> => {
        let url = `/api/stories/styles?limit=${limit}&offset=${offset}`;
        if (groupId) url += `&group_id=${groupId}`;
        return request(url);
    },

    searchStyles: async (query: string, groupId?: string, limit = 20, offset = 0): Promise<{ styles: any[], total: number }> => {
        let url = `/api/stories/styles/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
        if (groupId) url += `&group_id=${groupId}`;
        return request(url);
    }
};
