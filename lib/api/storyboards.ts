import { apiClient, request } from './client';
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

    // Dashboard: Group Storyboards
    getGroupStoryboards: async (page = 1, limit = 20): Promise<{ storyboards: Storyboard[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/dashboard/groups/storyboards?limit=${limit}&offset=${offset}`);
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
        if (parentId !== undefined) {
            endpoint += `&parentId=${parentId}`;
        }
        return request(endpoint);
    },

    // Detail
    get: async (id: string): Promise<Storyboard> => {
        return request(`/api/storyboards/${id}`);
    },

    // Actions
    like: async (id: string) => request(`/api/storyboards/${id}/like`, 'POST'),
    unlike: async (id: string) => request(`/api/storyboards/${id}/like`, 'DELETE'),
};
