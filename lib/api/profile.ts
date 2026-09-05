import { request, getUserIdFromToken } from './client';
import { Character, User, Story, Storyboard } from '../types';

export const profile = {
    // Drafts - Uses dashboard storyboards endpoint filtered by status
    getDrafts: async (page = 1, limit = 20): Promise<{ storyboards: Storyboard[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/dashboard/storyboards?limit=${limit}&offset=${offset}&status=draft`);
    },

    deleteDraft: async (id: string): Promise<void> => {
        return request(`/api/storyboards/${id}`, 'DELETE');
    },

    // Social - Followers
    getFollowers: async (userId: string, page = 1, limit = 20): Promise<{ users: User[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/followers?limit=${limit}&offset=${offset}`);
    },

    // Social - Following
    getFollowing: async (userId: string, page = 1, limit = 20): Promise<{ users: User[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/following?limit=${limit}&offset=${offset}`);
    },

    // Social - Follow/Unfollow
    // Note: Using /api/follows endpoint with followableType and followableID
    followUser: async (userId: string): Promise<void> => {
        return request('/api/follows', 'POST', {
            followableType: 'user',
            followableId: userId
        });
    },

    unfollowUser: async (userId: string): Promise<void> => {
        return request('/api/follows', 'DELETE', {
            followableType: 'user',
            followableId: userId
        });
    },

    // Check follow status
    isFollowing: async (userId: string): Promise<{ isFollowing: boolean }> => {
        return request(`/api/follows/check?type=user&id=${userId}`);
    },

    // Batch check follow status
    batchCheckFollowing: async (userIds: string[]): Promise<Record<string, boolean>> => {
        if (userIds.length === 0) return {};
        return request('/api/follows/batch-check', 'POST', {
            followableType: 'user',
            followableIds: userIds
        });
    },

    // Stories
    getStories: async (userId: string, page = 1, limit = 20): Promise<{ stories: Story[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/stories?limit=${limit}&offset=${offset}`);
    },

    // Characters
    getCharacters: async (userId: string, page = 1, limit = 20): Promise<{ characters: Character[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/characters?limit=${limit}&offset=${offset}`);
    },

    // Storyboards
    getStoryboards: async (userId: string, page = 1, limit = 20): Promise<{ storyboards: Storyboard[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/storyboards?limit=${limit}&offset=${offset}`);
    },

    // User Profile
    getProfile: async (userId: string): Promise<User> => {
        return request(`/api/users/${userId}`);
    },

    // Update own profile
    // Note: Backend uses PUT /api/users/:id
    updateProfile: async (data: {
        displayName?: string;
        bio?: string;
        avatar?: string;
        background?: string;
        website?: string;
        location?: string;
        dateOfBirth?: number;
    }): Promise<User> => {
        const userId = getUserIdFromToken();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        return request(`/api/users/${userId}`, 'PUT', data);
    },

    // Block/Unblock User
    blockUser: async (userId: string): Promise<void> =>
        request(`/api/users/${userId}/block`, 'POST'),

    unblockUser: async (userId: string): Promise<void> =>
        request(`/api/users/${userId}/block`, 'DELETE'),

    getBlockedUsers: async (
        page = 1,
        limit = 50
    ): Promise<{ users: Array<{ id: string; username?: string; displayName?: string; avatar?: string; blockedAt?: number }>; total: number }> => {
        const offset = (page - 1) * limit;
        const res = await request<{
            users?: Array<{ id: string; username?: string; displayName?: string; avatar?: string; blockedAt?: number }>;
            total?: number;
        }>(`/api/v1/users/blocked?limit=${limit}&offset=${offset}`);
        return {
            users: res?.users || [],
            total: res?.total ?? (res?.users?.length || 0),
        };
    },

    // Report User
    reportUser: async (userId: string, reason: string): Promise<void> =>
        request(`/api/users/${userId}/report`, 'POST', { reason }),

    // Report UGC (story / storyboard / fragment / character / comment)
    reportContent: async (
        contentType: 'storyboard' | 'story' | 'comment' | 'fragment' | 'character',
        contentId: string,
        reason: string,
    ): Promise<void> =>
        request('/api/content/report', 'POST', {
            content_type: contentType,
            content_id: contentId,
            reason,
        }),

    // Share profile
    getShareURL: (userId: string): string => {
        return `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${userId}`;
    },

    // Get own profile
    getMyProfile: async (): Promise<User> => {
        return request('/api/v1/auth/me');
    },

    // ==================== Stats & Points ====================

    getStats: async (userId: string): Promise<{
        storyCount: number;
        storyboardCount: number;
        characterCount: number;
        fragmentCount: number;
        followerCount: number;
        followingCount: number;
        totalLikes: number;
        totalViews: number;
    }> =>
        request(`/api/users/${userId}/stats`),

    getPoints: async (userId: string): Promise<{ points: number }> =>
        request(`/api/users/${userId}/points`),

    // ==================== Liked Content ====================

    getLikedStories: async (userId: string, page = 1, limit = 20): Promise<{ stories: Story[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/liked-stories?limit=${limit}&offset=${offset}`);
    },

    getLikedCharacters: async (userId: string, page = 1, limit = 20): Promise<{ characters: unknown[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/liked-characters?limit=${limit}&offset=${offset}`);
    },

    getLikedStoryboards: async (userId: string, page = 1, limit = 20): Promise<{ storyboards: Storyboard[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/liked-storyboards?limit=${limit}&offset=${offset}`);
    },

    // ==================== Creator Analytics ====================

    getCreatorAnalytics: async (range?: string): Promise<{
        totalStories: number;
        totalStoryboards: number;
        totalCharacters: number;
        totalFragments: number;
        viewsThisWeek: number;
        likesThisWeek: number;
        newFollowersThisWeek: number;
    }> => {
        const params = range ? `?range=${range}` : '';
        return request(`/api/me/creator-analytics${params}`);
    },

    // ==================== Quota & Dashboard ====================

    getQuota: async (): Promise<{
        aiQuota: { used: number; limit: number };
        storyboardQuota: { used: number; limit: number };
        characterQuota: { used: number; limit: number };
    }> => request('/api/me/quota'),

    getMeDashboard: async (): Promise<{
        recentStoryboards: Storyboard[];
        recentCharacters: unknown[];
        stats: Record<string, number>;
    }> => request('/api/me/dashboard'),

    getMeMembership: async (): Promise<unknown> =>
        request('/api/me/membership'),

    getMeUsage: async (period?: string): Promise<unknown> => {
        const params = period ? `?period=${period}` : '';
        return request(`/api/me/usage${params}`);
    },
};
