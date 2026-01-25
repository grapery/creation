import { apiClient, request } from './client';
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
    getMessages: async (characterId: string, limit = 20): Promise<CharacterMessage[]> => {
        return request(`/api/characters/${characterId}/messages?limit=${limit}`);
    },

    sendMessage: async (characterId: string, content: string): Promise<CharacterMessage> => {
        return request(`/api/characters/${characterId}/chat`, 'POST', { content });
    },

    // Interaction
    follow: async (id: string) => request(`/api/characters/${id}/follow`, 'POST'),
    unfollow: async (id: string) => request(`/api/characters/${id}/follow`, 'DELETE'),
};
