import { request } from './client';

export interface Tag {
    id: string;
    name: string;
    category?: 'genre' | 'theme' | 'style' | 'mood';
    usageCount: number;
}

export const tags = {
    // Get popular tags
    getPopular: async (limit = 20): Promise<{ tags: Tag[]; total: number }> => {
        return request(`/api/tags/popular?limit=${limit}`);
    },

    // Get stories by tag
    getStoriesByTag: async (tagId: string, page = 1, limit = 20): Promise<{ stories: any[]; total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/tags/${tagId}/stories?limit=${limit}&offset=${offset}`);
    },

    // Get story tags
    getStoryTags: async (storyId: string): Promise<{ tags: Tag[] }> => {
        return request(`/api/stories/${storyId}/tags`);
    },

    // Add tags to story
    addToStory: async (storyId: string, tagNames: string[]): Promise<void> => {
        return request(`/api/stories/${storyId}/tags`, 'POST', { tags: tagNames });
    }
};
