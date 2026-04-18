import { request, apiClient, AI_TIMEOUT } from './client';
import { Character, CharacterMessage } from '../types/character';

export const characters = {
    list: async (params: {
        page?: number;
        limit?: number;
        storyId?: string;
        authorId?: string;
        search?: string;
    } = {}): Promise<{ characters: Character[], total: number }> => {
        const { page = 1, limit = 20, storyId, authorId, search } = params;
        const queryParams = new URLSearchParams();
        queryParams.append('limit', limit.toString());
        queryParams.append('offset', ((page - 1) * limit).toString());
        if (storyId) queryParams.append('storyId', storyId);
        if (authorId) queryParams.append('authorId', authorId);
        if (search) queryParams.append('search', search);

        return request(`/api/characters?${queryParams.toString()}`);
    },

    get: async (id: string): Promise<Character> => {
        return request(`/api/characters/${id}`);
    },

    create: async (data: any): Promise<Character> => {
        return request('/api/characters', 'POST', data);
    },

    update: async (id: string, data: any): Promise<Character> => {
        return request(`/api/characters/${id}`, 'PUT', data);
    },

    delete: async (id: string): Promise<void> => {
        return request(`/api/characters/${id}`, 'DELETE');
    },

    // Chat / Messages
    // Note: Character chat endpoints not implemented in backend yet
    getMessages: async (_characterId: string, _limit = 20): Promise<CharacterMessage[]> => {
        console.warn('Character messages not implemented in backend');
        return [];
    },

    sendMessage: async (_characterId: string, _content: string): Promise<CharacterMessage> => {
        console.warn('Character chat not implemented in backend');
        throw new Error('Character chat not implemented');
    },

    // Interaction - Follow/Unfollow
    // Note: Using /api/follows endpoint with followableType and followableID
    follow: async (id: string) => request('/api/follows', 'POST', {
        followableType: 'character',
        followableId: id
    }),
    unfollow: async (id: string) => request('/api/follows', 'DELETE', {
        followableType: 'character',
        followableId: id
    }),

    // Check follow status
    isFollowing: async (id: string): Promise<{ isFollowing: boolean }> => {
        return request(`/api/follows/check?type=character&id=${id}`);
    },

    // Interaction - Like/Unlike
    // Note: Using /api/likes endpoint with likeableType and likeableId
    like: async (id: string) => request('/api/likes', 'POST', {
        likeableType: 'character',
        likeableId: id
    }),
    unlike: async (id: string) => request('/api/likes', 'DELETE', {
        likeableType: 'character',
        likeableId: id
    }),

    // Check like status
    isLiked: async (id: string): Promise<{ isLiked: boolean }> => {
        return request(`/api/likes/check?type=character&id=${id}`);
    },

    // Batch check like status
    batchCheckLiked: async (characterIds: string[]): Promise<Record<string, boolean>> => {
        if (characterIds.length === 0) return {};
        return request('/api/likes/batch-check', 'POST', {
            likeableType: 'character',
            likeableIds: characterIds
        });
    },

    // Batch check follow status
    batchCheckFollowing: async (characterIds: string[]): Promise<Record<string, boolean>> => {
        if (characterIds.length === 0) return {};
        return request('/api/follows/batch-check', 'POST', {
            followableType: 'character',
            followableIds: characterIds
        });
    },

    // ==================== AI Generation ====================

    generate: async (data: {
        prompt: string;
        name?: string;
    }): Promise<Character> =>
        request('/api/characters/generate', 'POST', data, apiClient, AI_TIMEOUT),

    generateAvatar: async (id: string, params?: { style?: string }): Promise<{ avatarUrl: string }> =>
        request(`/api/characters/${id}/generate-avatar`, 'POST', params || {}, apiClient, AI_TIMEOUT),

    generatePortrait: async (id: string, params?: { style?: string; prompt?: string }): Promise<{ portraitUrl: string }> =>
        request(`/api/characters/${id}/generate-portrait`, 'POST', params || {}, apiClient, AI_TIMEOUT),

    generateThreeViews: async (id: string, params?: { regenerateAll?: boolean }): Promise<{ viewsUrl: string }> =>
        request(`/api/characters/${id}/generate-three-views`, 'POST', params || {}, apiClient, AI_TIMEOUT),

    cropAvatar: async (id: string): Promise<{ avatarUrl: string }> =>
        request(`/api/characters/${id}/crop-avatar`, 'POST'),

    usePortraitAsAvatar: async (id: string, portraitUrl: string): Promise<{ avatarUrl: string }> =>
        request(`/api/characters/${id}/use-portrait-as-avatar`, 'PUT', { portraitUrl }),

    getPortraitPrompt: async (id: string): Promise<{ prompt: string }> =>
        request(`/api/characters/${id}/portrait-prompt`),

    updateAvatar: async (id: string, avatarUrl: string): Promise<Character> =>
        request(`/api/characters/${id}/avatar`, 'PUT', { avatarUrl }),

    // ==================== Analytics & Relations ====================

    getAnalytics: async (id: string): Promise<{
        totalStoryboards: number;
        totalLikes: number;
        totalForks: number;
        totalViews: number;
    }> =>
        request(`/api/characters/${id}/analytics`),

    getStoryboards: async (id: string, page = 1, limit = 20): Promise<{
        storyboards: any[];
        total: number;
    }> => {
        const offset = (page - 1) * limit;
        return request(`/api/characters/${id}/storyboards?limit=${limit}&offset=${offset}`);
    },
};
