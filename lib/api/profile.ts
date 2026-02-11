import { request, getUserIdFromToken } from './client';
import { User, Story, Storyboard, ActivityHeatmapData, ActivityTimeRange, ActivityHeatmapResponse } from '../types';

export interface UserActivity {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    targetId?: string;
    targetType?: 'story' | 'character' | 'storyboard';
    targetName: string;
    targetImage?: string;
    message: string;
    timestamp: number | null;
    date?: string;
    user: {
        id: string;
        username: string;
        displayName?: string;
        avatar?: string;
    };
}

export const profile = {
    // Drafts - Note: Backend returns Storyboard[], not Story[]
    getDrafts: async (page = 1, limit = 20): Promise<{ drafts: Storyboard[], count: number }> => {
        const userId = getUserIdFromToken();
        if (!userId) {
            throw new Error('User not authenticated');
        }
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/drafts?limit=${limit}&offset=${offset}`);
    },

    // Get user's published drafts (for viewing another user's profile)
    getUserDrafts: async (userId: string, page = 1, limit = 20): Promise<{ drafts: Storyboard[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/drafts?limit=${limit}&offset=${offset}`);
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

    // Activity
    getActivity: async (
        userId: string,
        page = 1,
        limit = 20,
        timeRange: ActivityTimeRange = ActivityTimeRange.WEEK
    ): Promise<{ activities: UserActivity[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(
            `/api/users/${userId}/activities?limit=${limit}&offset=${offset}&time_range=${timeRange}`
        );
    },

    // Activity Heatmap
    getHeatmap: async (
        userId: string,
        timeRange: ActivityTimeRange = ActivityTimeRange.MONTH
    ): Promise<ActivityHeatmapResponse> => {
        return request(`/api/users/${userId}/activities/heatmap?time_range=${timeRange}`);
    },

    // Stories
    getStories: async (userId: string, page = 1, limit = 20): Promise<{ stories: Story[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/users/${userId}/stories?limit=${limit}&offset=${offset}`);
    },

    // Characters
    getCharacters: async (userId: string, page = 1, limit = 20): Promise<{ characters: any[], count: number }> => {
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
    // Note: Backend does not have block/unblock endpoints yet
    blockUser: async (_userId: string): Promise<void> => {
        console.warn('Block user not implemented');
        return Promise.resolve();
    },

    unblockUser: async (_userId: string): Promise<void> => {
        console.warn('Unblock user not implemented');
        return Promise.resolve();
    },

    // Report User
    // Note: Backend does not have report endpoint yet
    reportUser: async (_userId: string, _reason: string): Promise<void> => {
        console.warn('Report user not implemented');
        return Promise.resolve();
    },

    // Share profile
    getShareURL: (userId: string): string => {
        return `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${userId}`;
    },

    // Get own profile
    // Note: Using /api/auth/me endpoint
    getMyProfile: async (): Promise<User> => {
        return request('/api/auth/me');
    },
};
