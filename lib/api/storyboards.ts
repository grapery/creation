import { request } from './client';
import { Storyboard } from '../types';

export const storyboards = {
    // Feed (Public/Community)
    getFeed: async (page = 1, limit = 20): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/storyboards/feed?limit=${limit}&offset=${offset}`);
    },

    // Dashboard: Storyboards (Authenticated)
    getDashboardStoryboards: async (page = 1, limit = 20): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/dashboard/storyboards?limit=${limit}&offset=${offset}`);
    },

    // Dashboard: Trending (Public/Auth)
    getTrending: async (page = 1, limit = 20): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/dashboard/trending/storyboards?limit=${limit}&offset=${offset}`);
    },

    // Dashboard: Character Storyboards
    getCharacterStoryboards: async (page = 1, limit = 20): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/dashboard/characters/storyboards?limit=${limit}&offset=${offset}`);
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

    // Detail
    get: async (id: string): Promise<Storyboard> => {
        return request(`/api/storyboards/${id}`);
    },

    // Get child storyboards (forks)
    getChildren: async (id: string): Promise<Storyboard[]> => {
        return request(`/api/storyboards/${id}/children`);
    },

    // Get parent storyboard
    getParent: async (id: string, parentId: string): Promise<Storyboard> => {
        return request(`/api/storyboards/${parentId}`);
    },

    // Actions
    // Note: Using /api/likes endpoint with likeableType and likeableId
    like: async (id: string) => request('/api/likes', 'POST', {
        likeableType: 'storyboard_node',
        likeableId: id
    }),
    unlike: async (id: string) => request('/api/likes', 'DELETE', {
        likeableType: 'storyboard_node',
        likeableId: id
    }),

    // Check like status
    isLiked: async (id: string): Promise<{ isLiked: boolean }> => {
        return request(`/api/likes/check?type=storyboard_node&id=${id}`);
    },

    // Batch check like status
    batchCheckLiked: async (storyboardIds: string[]): Promise<Record<string, boolean>> => {
        if (storyboardIds.length === 0) return {};
        return request('/api/likes/batch-check', 'POST', {
            likeableType: 'storyboard_node',
            likeableIds: storyboardIds
        });
    },
};
