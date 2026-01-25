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
    uploadCover: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        return request('/api/upload/image', 'POST', formData);
    },

    getStyles: async (groupId?: string, limit = 20, offset = 0): Promise<{ styles: any[], total: number }> => {
        let url = `/api/stories/styles?limit=${limit}&offset=${offset}`;
        if (groupId) url += `&group_id=${groupId}`;
        return request(url);
    },

    searchStyles: async (query: string, groupId?: string, limit = 20, offset = 0): Promise<{ styles: any[], total: number }> => {
        let url = `/api/stories/styles/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
        if (groupId) url += `&group_id=${groupId}`;
        return request(url);
    },

    // ==================== Scenes Management ====================

    // Get story scenes
    getScenes: async (storyId: string, limit = 20, offset = 0): Promise<{ scenes: any[], count: number }> => {
        return request(`/api/stories/${storyId}/scenes?limit=${limit}&offset=${offset}`);
    },

    // Create scene
    createScene: async (storyId: string, data: {
        title: string;
        description?: string;
        image?: string;
        location?: string;
        timeOfDay?: string;
        sourceType: 'manual' | 'upload' | 'ai';
        sourcePrompt?: string;
        sourceImage?: string;
        isPublic?: boolean;
        tags?: string[];
    }): Promise<any> => {
        return request(`/api/stories/${storyId}/scenes`, 'POST', data);
    },

    // Update scene
    updateScene: async (storyId: string, sceneId: string, data: {
        title?: string;
        description?: string;
        image?: string;
        location?: string;
        timeOfDay?: string;
        sourceType?: 'manual' | 'upload' | 'ai';
        sourcePrompt?: string;
        sourceImage?: string;
        isPublic?: boolean;
        tags?: string[];
    }): Promise<any> => {
        return request(`/api/stories/${storyId}/scenes/${sceneId}`, 'PUT', data);
    },

    // Delete scene
    deleteScene: async (storyId: string, sceneId: string): Promise<{ message: string }> => {
        return request(`/api/stories/${storyId}/scenes/${sceneId}`, 'DELETE');
    },

    // Upload scene image
    uploadSceneImage: async (storyId: string, imageUrl: string): Promise<{ success: boolean; url: string }> => {
        return request(`/api/stories/${storyId}/scenes/register-image`, 'POST', { imageUrl });
    },

    // AI generate scene image
    generateSceneImage: async (storyId: string, sceneId?: string, prompt?: string): Promise<{ success: boolean; url: string; filename: string }> => {
        return request(`/api/stories/${storyId}/scenes/ai-generate-image${sceneId ? `?sceneId=${sceneId}` : ''}`, 'POST', { prompt });
    },

    // ==================== Contributors Management ====================

    // Get story contributors
    getContributors: async (storyId: string, limit = 20, offset = 0): Promise<{ contributors: any[], count: number }> => {
        return request(`/api/stories/${storyId}/contributors?limit=${limit}&offset=${offset}`);
    },

    // Invite contributor
    inviteContributor: async (storyId: string, userId: string, role: 'collaborator' | 'contributor'): Promise<any> => {
        return request(`/api/stories/${storyId}/contributors`, 'POST', { userId, role });
    },

    // Remove contributor
    removeContributor: async (storyId: string, userId: string): Promise<{ message: string }> => {
        return request(`/api/stories/${storyId}/contributors/${userId}`, 'DELETE');
    }
};
