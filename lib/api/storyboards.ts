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
};
