import { request } from './client';

export interface Fragment {
    id: string;
    userId: string;
    userName?: string;
    userAvatar?: string;
    content: string;
    images?: string[];
    style?: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked?: boolean;
    isPublic: boolean;
    createdAt: number;
}

export interface FragmentComment {
    id: string;
    fragmentId: string;
    userId: string;
    userName?: string;
    userAvatar?: string;
    content: string;
    parentId?: string;
    createdAt: number;
}

export interface FragmentStats {
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
}

export const fragments = {
    // List fragments (feed)
    list: async (params?: {
        feedType?: 'following' | 'popular' | 'recent';
        page?: number;
        limit?: number;
    }): Promise<{ fragments: Fragment[]; total: number }> => {
        const { feedType = 'recent', page = 1, limit = 20 } = params || {};
        const offset = (page - 1) * limit;
        // Note: Backend endpoint may vary, using common pattern
        return request(`/api/fragments?feed=${feedType}&limit=${limit}&offset=${offset}`);
    },

    // Get fragment by ID
    get: async (id: string): Promise<Fragment> => {
        return request(`/api/fragments/${id}`);
    },

    // Create fragment
    create: async (data: {
        content: string;
        images?: string[];
        style?: string;
        isPublic?: boolean;
    }): Promise<Fragment> => {
        return request('/api/fragments', 'POST', data);
    },

    // Delete fragment
    delete: async (id: string): Promise<void> => {
        return request(`/api/fragments/${id}`, 'DELETE');
    },

    // Convert fragment to story
    convertToStory: async (fragmentId: string): Promise<{ storyId: string }> => {
        return request(`/api/fragments/${fragmentId}/convert-to-story`, 'POST');
    },

    // Like fragment
    like: async (id: string): Promise<void> => {
        return request(`/api/fragments/${id}/like`, 'POST');
    },

    // Unlike fragment
    unlike: async (id: string): Promise<void> => {
        return request(`/api/fragments/${id}/like`, 'DELETE');
    },

    // Get fragment likes
    getLikes: async (id: string, page = 1, limit = 20): Promise<{ users: any[]; total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/fragments/${id}/likes?limit=${limit}&offset=${offset}`);
    },

    // Get fragment comments
    getComments: async (id: string, page = 1, limit = 20): Promise<{ comments: FragmentComment[]; total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/fragments/${id}/comments?limit=${limit}&offset=${offset}`);
    },

    // Add comment to fragment
    addComment: async (fragmentId: string, content: string, parentId?: string): Promise<FragmentComment> => {
        return request(`/api/fragments/${fragmentId}/comments`, 'POST', { content, parentId });
    },

    // Update comment
    updateComment: async (commentId: string, content: string): Promise<FragmentComment> => {
        return request(`/api/fragments/comments/${commentId}`, 'PUT', { content });
    },

    // Delete comment
    deleteComment: async (commentId: string): Promise<void> => {
        return request(`/api/fragments/comments/${commentId}`, 'DELETE');
    },

    // Share fragment
    share: async (id: string): Promise<{ shareUrl: string }> => {
        return request(`/api/fragments/${id}/share`, 'POST');
    },

    // Get fragment stats
    getStats: async (id: string): Promise<FragmentStats> => {
        return request(`/api/fragments/${id}/stats`);
    },

    // Generate fragment with AI
    generate: async (data: {
        prompt: string;
        style?: string;
    }): Promise<{ taskId: string }> => {
        return request('/api/fragments/generate', 'POST', data);
    },

    // Get generation status
    getGenerationStatus: async (taskId: string): Promise<{
        status: 'pending' | 'processing' | 'completed' | 'failed';
        result?: Fragment;
        error?: string;
    }> => {
        return request(`/api/fragments/generate/${taskId}`);
    },

    // Get generation styles
    getStyles: async (): Promise<{ styles: string[] }> => {
        return request('/api/fragments/styles');
    }
};
