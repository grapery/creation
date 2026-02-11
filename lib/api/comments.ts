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
        return request(`/api/comments?targetId=${targetId}&targetType=${targetType}&limit=${limit}&offset=${(page - 1) * limit}`);
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
    }
};
