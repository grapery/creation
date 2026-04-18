import { request } from './client';
import { User } from '../types';

export interface Comment {
    id: string;
    content: string;
    userId: string;
    targetId: string; // StoryId or StoryboardId
    targetType: 'story' | 'storyboard';
    createdAt: number;
    user?: User;
    likes?: number;
    replyCount?: number;
    parentId?: string; // For nested comments
}

export const comments = {
    // Get comments for a target
    list: async (targetId: string, targetType: string, page = 1, limit = 20): Promise<{ comments: Comment[], total: number }> => {
        return request(`/api/comments?target_id=${targetId}&target_type=${targetType}&limit=${limit}&offset=${(page - 1) * limit}`);
    },

    // Create a comment
    create: async (data: { targetId: string, targetType: string, content: string, parentId?: string }): Promise<Comment> => {
        return request('/api/comments', 'POST', data);
    },

    // Delete
    delete: async (id: string): Promise<void> => {
        return request(`/api/comments/${id}`, 'DELETE');
    },

    // Like
    like: async (id: string): Promise<void> => {
        return request(`/api/comments/${id}/like`, 'POST');
    },

    // Unlike
    unlike: async (id: string): Promise<void> => {
        return request(`/api/comments/${id}/like`, 'DELETE');
    },

    // Toggle like (PUT — server toggles state)
    toggleLike: async (id: string): Promise<{ isLiked: boolean }> => {
        return request(`/api/comments/${id}/like`, 'PUT');
    },

    // Dislike
    dislike: async (id: string): Promise<void> => {
        return request(`/api/comments/${id}/dislike`, 'POST');
    },

    // Get comment by ID
    get: async (id: string): Promise<Comment> =>
        request(`/api/comments/${id}`),

    // Update comment
    update: async (id: string, content: string): Promise<Comment> =>
        request(`/api/comments/${id}`, 'PUT', { content }),

    // Get comment replies
    getReplies: async (id: string, page = 1, limit = 20): Promise<{ comments: Comment[]; total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/comments/${id}/replies?limit=${limit}&offset=${offset}`);
    },

    // Get comment tree (nested)
    getTree: async (id: string): Promise<Comment> =>
        request(`/api/comments/${id}/tree`),

    // Create a reply to a comment
    createReply: async (commentId: string, content: string): Promise<Comment> =>
        request(`/api/comments/${commentId}/replies`, 'POST', { content }),
};
