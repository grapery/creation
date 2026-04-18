import { request, apiClient, AI_TIMEOUT } from './client';
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

    delete: async (id: string): Promise<void> => {
        return request(`/api/stories/${id}`, 'DELETE');
    },

    // Like/Unlike story
    // Note: Using /api/likes endpoint with likeableType and likeableId
    like: async (id: string) => request('/api/likes', 'POST', {
        likeableType: 'story',
        likeableId: id
    }),
    unlike: async (id: string) => request('/api/likes', 'DELETE', {
        likeableType: 'story',
        likeableId: id
    }),

    // Follow/Unfollow story
    // Note: Using /api/follows endpoint with followableType and followableID
    follow: async (id: string) => request('/api/follows', 'POST', {
        followableType: 'story',
        followableId: id
    }),
    unfollow: async (id: string) => request('/api/follows', 'DELETE', {
        followableType: 'story',
        followableId: id
    }),

    // Check follow status
    isFollowing: async (id: string): Promise<{ isFollowing: boolean }> => {
        return request(`/api/follows/check?type=story&id=${id}`);
    },

    // Check like status
    isLiked: async (id: string): Promise<{ isLiked: boolean }> => {
        return request(`/api/likes/check?type=story&id=${id}`);
    },

    // Batch check like status
    batchCheckLiked: async (storyIds: string[]): Promise<Record<string, boolean>> => {
        if (storyIds.length === 0) return {};
        return request('/api/likes/batch-check', 'POST', {
            likeableType: 'story',
            likeableIds: storyIds
        });
    },

    // Batch check follow status
    batchCheckFollowing: async (storyIds: string[]): Promise<Record<string, boolean>> => {
        if (storyIds.length === 0) return {};
        return request('/api/follows/batch-check', 'POST', {
            followableType: 'story',
            followableIds: storyIds
        });
    },

    // Following Feed — uses storyboard feed with tab=following
    getFollowingStories: async (page = 1, limit = 20): Promise<{ stories: Story[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/storyboards/feed?tab=following&limit=${limit}&offset=${offset}`);
    },
    // AI Styles
    uploadCover: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        return request('/api/upload/image', 'POST', formData);
    },

    // Note: Style endpoints are at /api/styles, not /api/stories/styles
    getStyles: async (limit = 20, offset = 0): Promise<{ styles: any[], total: number }> => {
        return request(`/api/styles?limit=${limit}&offset=${offset}`);
    },

    searchStyles: async (query: string, limit = 20, offset = 0): Promise<{ styles: any[], total: number }> => {
        return request(`/api/styles/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
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
        return request(`/api/stories/${storyId}/scenes/ai-generate-image${sceneId ? `?sceneId=${sceneId}` : ''}`, 'POST', { prompt }, apiClient, AI_TIMEOUT);
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
    },

    // ==================== Panels Management ====================

    getPanels: async (storyId: string): Promise<{ panels: any[] }> =>
        request(`/api/stories/${storyId}/panels`),

    createPanel: async (storyId: string, data: {
        title?: string;
        imageUrl?: string;
        text?: string;
        textPosition?: string;
        sequence?: number;
    }): Promise<any> =>
        request(`/api/stories/${storyId}/panels`, 'POST', data),

    updatePanel: async (storyId: string, panelId: string, data: {
        title?: string;
        imageUrl?: string;
        text?: string;
        textPosition?: string;
        sequence?: number;
    }): Promise<any> =>
        request(`/api/stories/${storyId}/panels/${panelId}`, 'PUT', data),

    deletePanel: async (storyId: string, panelId: string): Promise<{ message: string }> =>
        request(`/api/stories/${storyId}/panels/${panelId}`, 'DELETE'),

    reorderPanels: async (storyId: string, panelIds: string[]): Promise<{ message: string }> =>
        request(`/api/stories/${storyId}/panels/reorder`, 'POST', { panelIds }),

    // ==================== Default Path ====================

    setDefaultPath: async (storyId: string, nodeIds: string[]): Promise<{ message: string }> =>
        request(`/api/stories/${storyId}/default-path`, 'POST', { nodeIds }),

    autoCalculatePath: async (storyId: string): Promise<{ nodeIds: string[]; count: number }> =>
        request(`/api/stories/${storyId}/default-path/auto`, 'POST'),

    getDefaultPath: async (storyId: string): Promise<{ nodeIds: string[]; count: number }> =>
        request(`/api/stories/${storyId}/default-path`),

    // ==================== Render & Publish ====================

    renderStory: async (storyId: string, params?: {
        enrichDescription?: boolean;
        generateBackground?: boolean;
        generateCover?: boolean;
        style?: string;
        aspectRatio?: string;
    }): Promise<any> =>
        request(`/api/stories/${storyId}/render`, 'POST', params || {}),

    renderMedia: async (storyId: string, params: {
        type: string;
        resolution?: string;
        quality?: string;
    }): Promise<{ taskId: string }> =>
        request(`/api/stories/${storyId}/render-media`, 'POST', params),

    getRenderStatus: async (storyId: string): Promise<{
        tasks: any[];
        overallStatus: string;
    }> =>
        request(`/api/stories/${storyId}/render-status`),

    publish: async (storyId: string): Promise<Story> =>
        request(`/api/stories/${storyId}/publish`, 'POST'),

    unpublish: async (storyId: string): Promise<Story> =>
        request(`/api/stories/${storyId}/unpublish`, 'POST'),

    // ==================== Story Tags ====================

    getTags: async (storyId: string): Promise<{ tags: string[] }> =>
        request(`/api/stories/${storyId}/tags`),

    addTags: async (storyId: string, tags: string[]): Promise<{ message: string }> =>
        request(`/api/stories/${storyId}/tags`, 'POST', { tags }),

    getStats: async (storyId: string): Promise<{
        viewCount: number;
        likeCount: number;
        commentCount: number;
        followerCount: number;
    }> =>
        request(`/api/stories/${storyId}/stats`),
};
