import { apiClient, request, getUserIdFromToken } from './client';
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
    timestamp: number;
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
        return request(`/api/users/${userId}/draft-storyboards?limit=${limit}&offset=${offset}`);
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
    followUser: async (userId: string): Promise<void> => {
        return request(`/api/users/${userId}/follow`, 'POST');
    },

    unfollowUser: async (userId: string): Promise<void> => {
        return request(`/api/users/${userId}/follow`, 'DELETE');
    },

    // Check follow status
    isFollowing: async (userId: string): Promise<{ isFollowing: boolean }> => {
        return request(`/api/users/${userId}/follow/status`);
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

    // User Profile
    getProfile: async (userId: string): Promise<User> => {
        return request(`/api/users/${userId}`);
    },

    // Update own profile
    updateProfile: async (data: {
        displayName?: string;
        bio?: string;
        avatar?: string;
        background?: string;
        website?: string;
        location?: string;
        dateOfBirth?: number;
    }): Promise<User> => {
        return request('/api/profile', 'PUT', data);
    },

    // Block/Unblock User
    blockUser: async (userId: string): Promise<void> => {
        return request(`/api/users/${userId}/block`, 'POST');
    },

    unblockUser: async (userId: string): Promise<void> => {
        return request(`/api/users/${userId}/block`, 'DELETE');
    },

    // Report User
    reportUser: async (userId: string, reason: string): Promise<void> => {
        return request(`/api/users/${userId}/report`, 'POST', { reason });
    },

    // Share profile
    getShareURL: (userId: string): string => {
        return `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${userId}`;
    },

    // Get own profile
    getMyProfile: async (): Promise<User> => {
        return request('/api/profile');
    },
};
