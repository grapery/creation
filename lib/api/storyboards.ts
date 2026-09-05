import { request, apiClient, AI_TIMEOUT } from './client';
import { withShareGrant, type ShareGrant } from '@/lib/share-grant';
import { Storyboard } from '../types';

export const storyboards = {
    // Create
    create: async (data: {
        storyId: string;
        rawInput: string;
        parentId?: string;
        title?: string;
        characterRefs?: string[];
        sceneRefs?: string[];
        tags?: string[];
        sceneCount?: number;
    }): Promise<Storyboard> => {
        return request('/api/storyboards', 'POST', data);
    },

    // Update
    update: async (id: string, data: {
        title?: string;
        content?: string;
        rawInput?: string;
        sceneRefs?: string[];
        characterRefs?: string[];
    }): Promise<Storyboard> => {
        return request(`/api/storyboards/${id}`, 'PUT', data);
    },

    // Delete
    delete: async (id: string): Promise<void> => {
        return request(`/api/storyboards/${id}`, 'DELETE');
    },

    // Feed (Public/Community)
    getFeed: async (page = 1, limit = 20, tab?: string): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        const tabParam = tab ? `&tab=${tab}` : '';
        return request(`/api/storyboards/feed?limit=${limit}&offset=${offset}${tabParam}`);
    },

    // Dashboard: Storyboards (Authenticated)
    getDashboardStoryboards: async (page = 1, limit = 20): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/dashboard/storyboards?limit=${limit}&offset=${offset}`);
    },

    // Trending (Public endpoint)
    getTrending: async (page = 1, limit = 20): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/public/trending/storyboards?limit=${limit}&offset=${offset}`);
    },

    // Dashboard: Character Storyboards - Backend endpoint removed, use characters/:id/storyboards instead
    getCharacterStoryboards: async (characterId: string, page = 1, limit = 20): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/characters/${characterId}/storyboards?limit=${limit}&offset=${offset}`);
    },

    // Story: Get storyboards for a specific story
    getByStoryId: async (storyId: string, parentId?: string | null, page = 1, limit = 20): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        let endpoint = `/api/storyboards?storyId=${storyId}&limit=${limit}&offset=${offset}`;
        // Only add parentId parameter if it's explicitly set (not null or undefined)
        // Backend expects: empty string or "root" for root storyboards, or specific ID for children
        if (parentId !== undefined && parentId !== null) {
            endpoint += `&parentId=${parentId}`;
        }
        return request(endpoint);
    },

    // Detail — use /api/v1 so signed ?t=&exp= reach Grapery (BFF strips query).
    get: async (id: string, shareGrant?: ShareGrant): Promise<Storyboard> => {
        return request(withShareGrant(`/api/v1/storyboards/${id}`, shareGrant));
    },

    // Get child storyboards (forks)
    getChildren: async (id: string, page = 1, limit = 20): Promise<Storyboard[]> => {
        const offset = (page - 1) * limit;
        return request(`/api/storyboards/${id}/children?limit=${limit}&offset=${offset}`);
    },

    // Get parent storyboard
    getParent: async (id: string, parentId: string): Promise<Storyboard> => {
        return request(`/api/storyboards/${parentId}`);
    },

    // Actions — 与后端唯一数据源一致：storyboard_likes + storyboards.likes
    like: async (id: string) => request(`/api/storyboards/${id}/like`, 'POST'),
    unlike: async (id: string) => request(`/api/storyboards/${id}/like`, 'DELETE'),

    // 仍走互动接口；服务端已将 storyboard_node 委托到 storyboard_likes
    isLiked: async (id: string): Promise<{ isLiked: boolean }> => {
        return request(`/api/likes/check?type=storyboard_node&id=${id}`);
    },

    batchCheckLiked: async (storyboardIds: string[]): Promise<Record<string, boolean>> => {
        if (storyboardIds.length === 0) return {};
        return request('/api/likes/batch-check', 'POST', {
            likeableType: 'storyboard_node',
            likeableIds: storyboardIds
        });
    },

    // ==================== Tree & Branching ====================

    getTree: async (id: string): Promise<{ tree: Storyboard[] }> =>
        request(`/api/storyboards/${id}/tree`),

    fork: async (id: string, data: {
        title: string;
        rawInput: string;
        content?: string;
        isStandalone?: boolean;
        sceneCount?: number;
    }): Promise<Storyboard> =>
        request(`/api/storyboards/${id}/fork`, 'POST', data),

    continue_: async (id: string, data: {
        rawInput: string;
        sceneCount?: number;
        characters?: string[];
        generateVideo?: boolean;
        comicStyle?: string;
    }): Promise<{
        newStoryboard: Storyboard;
        generatedScenes: unknown[];
        tokensUsed?: number;
    }> =>
        request(`/api/storyboards/${id}/continue`, 'POST', data),

    publish: async (id: string): Promise<Storyboard> =>
        request(`/api/storyboards/${id}/publish`, 'POST'),

    // ==================== Panels ====================

    getPanels: async (id: string, page = 1, limit = 20): Promise<{ panels: unknown[] }> => {
        const offset = (page - 1) * limit;
        return request(`/api/storyboards/${id}/panels?limit=${limit}&offset=${offset}`);
    },

    createPanel: async (id: string, data: {
        sequence: number;
        imageUrl?: string;
        text?: string;
    }): Promise<unknown> =>
        request(`/api/storyboards/${id}/panels`, 'POST', data),

    // ==================== Generation ====================

    retryFailedImages: async (id: string): Promise<{ message: string }> =>
        request(`/api/storyboards/${id}/retry-failed-images`, 'POST'),

    cancelGeneration: async (id: string): Promise<{ message: string }> =>
        request(`/api/storyboards/${id}/cancel-generation`, 'POST'),

    getGenerationProgress: async (id: string): Promise<{
        status: string;
        currentStep: string;
        totalSteps: number;
        completedSteps: number;
        progress: number;
    }> =>
        request(`/api/storyboards/${id}/generation-progress`),

    // ==================== AI Generation ====================
    // NOTE: generateContent, generateSceneDetails, generateImage, generateAllImages, generateVideo
    // are now in lib/api/creation.ts which is the authoritative module for AI generation.

    /** Multi-panel comic page (single output image); separate from generateImage. */
    generateComicPage: async (id: string, data: Record<string, unknown>): Promise<{ message: string }> =>
        request(`/api/storyboards/${id}/generate/comic-page`, 'POST', data, apiClient, AI_TIMEOUT),

    generateAllComicPages: async (id: string, data?: Record<string, unknown>): Promise<{ message: string }> =>
        request(`/api/storyboards/${id}/generate/comic-pages`, 'POST', data || {}, apiClient, AI_TIMEOUT),

    // ==================== Video Streaming ====================

    getVideoPlaylist: (id: string): string =>
        `/api/storyboards/${id}/playlist.m3u8`,

    getScenePlaylist: (id: string, sceneId: string): string =>
        `/api/storyboards/${id}/scenes/${sceneId}/playlist.m3u8`,
};
