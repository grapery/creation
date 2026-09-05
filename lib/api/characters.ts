import { request, apiClient, AI_TIMEOUT } from './client';
import { withShareGrant, type ShareGrant } from '@/lib/share-grant';
import { Character, CharacterMessage } from '../types/character';
import type { Storyboard } from '../types';

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

    // Prefer /api/v1 so signed ?t=&exp= reach Grapery (BFF strips query).
    get: async (id: string, shareGrant?: ShareGrant): Promise<Character> => {
        return request(withShareGrant(`/api/v1/characters/${id}`, shareGrant));
    },

    create: async (data: unknown): Promise<Character> => {
        return request('/api/characters', 'POST', data);
    },

    update: async (id: string, data: unknown): Promise<Character> => {
        return request(`/api/characters/${id}`, 'PUT', data);
    },

    delete: async (id: string): Promise<void> => {
        return request(`/api/characters/${id}`, 'DELETE');
    },

    getMessages: async (characterId: string, limit = 20): Promise<CharacterMessage[]> => {
        const { chat } = await import('./chat');
        const session = await chat.startSession(characterId);
        const msgs = await chat.getMessages(session.id, undefined, limit);
        return msgs.map((m) => ({
            id: m.id,
            role: (m.role === 'assistant' ? 'assistant' : 'user') as CharacterMessage['role'],
            content: m.content,
            timestamp: m.timestamp,
        }));
    },

    sendMessage: async (characterId: string, content: string): Promise<CharacterMessage> => {
        const { chat } = await import('./chat');
        const session = await chat.startSession(characterId);
        const result = await chat.sendMessage(session.id, content);
        return {
            id: result.userMessage.id,
            role: 'user',
            content: result.userMessage.content,
            timestamp: result.userMessage.timestamp,
        };
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
        storyboards: Storyboard[];
        total: number;
    }> => {
        const offset = (page - 1) * limit;
        return request(`/api/characters/${id}/storyboards?limit=${limit}&offset=${offset}`);
    },

    // ==================== Character Generation Tasks ====================

    startGenerationTask: async (data: {
        prompt: string;
        storyId?: string;
        name?: string;
        gender?: string;
        style?: string;
    }): Promise<{ taskId: string; status: string }> =>
        request('/api/character-generation-tasks', 'POST', data, apiClient, AI_TIMEOUT),

    listGenerationTasks: async (params?: {
        limit?: number;
        offset?: number;
        status?: string;
    }): Promise<{ tasks: unknown[]; total: number }> => {
        const query = new URLSearchParams();
        if (params?.limit) query.set('limit', params.limit.toString());
        if (params?.offset) query.set('offset', params.offset.toString());
        if (params?.status) query.set('status', params.status);
        return request(`/api/character-generation-tasks?${query.toString()}`);
    },

    getGenerationTask: async (taskId: string): Promise<unknown> =>
        request(`/api/character-generation-tasks/${taskId}`),

    retryGenerationTask: async (taskId: string): Promise<unknown> =>
        request(`/api/character-generation-tasks/${taskId}/retry`, 'POST'),

    dismissFromDrafts: async (taskId: string): Promise<void> =>
        request(`/api/character-generation-tasks/${taskId}/dismiss-from-drafts`, 'POST'),

    getFragmentCharacterSuggestions: async (storyId: string): Promise<unknown> =>
        request(`/api/stories/${storyId}/fragment-character-suggestions`),
};
