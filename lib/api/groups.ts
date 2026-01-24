import { apiClient, request } from './client';
import {
    BranchGroup,
    GroupActivity,
    GroupInvite,
    ActivityHeatmapResponse,
    ActivityTimeRange,
    GroupMember,
} from '../types';

// Export for backward compatibility
export interface GroupActivityCompat {
    id: string;
    type: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    storyId?: string;
    storyTitle?: string;
    message: string;
    timestamp: number;
    date?: string;
}

export interface ActivityHeatmapData {
    date: string;
    count: number;
}

export interface ActivityHeatmapResponseCompat {
    timeRange: string;
    startDate: string;
    endDate: string;
    heatmapData: ActivityHeatmapData[];
    totalCount: number;
}

export const groups = {
    // List Groups (Public/Dashboard)
    list: async (page = 1, limit = 20): Promise<BranchGroup[]> => {
        const offset = (page - 1) * limit;
        return request<{ groups: BranchGroup[], count: number }>(`/api/groups?limit=${limit}&offset=${offset}`)
            .then(res => res.groups);
    },

    // My Groups (Authenticated)
    getMyGroups: async (page = 1, limit = 20): Promise<{ groups: BranchGroup[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/groups?limit=${limit}&offset=${offset}&myGroups=true`);
    },

    // Discover Groups (Public)
    getDiscoverGroups: async (page = 1, limit = 20): Promise<{ groups: BranchGroup[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/groups?limit=${limit}&offset=${offset}&discover=true`);
    },

    // Search Groups
    search: async (query: string, page = 1, limit = 20): Promise<{ groups: BranchGroup[], total: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/groups/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    },

    // Get Group Details
    get: async (id: string): Promise<BranchGroup> => {
        return request(`/api/groups/${id}`);
    },

    // Create Group
    create: async (data: {
        name: string;
        description?: string;
        isPublic: boolean;
        avatar?: string;
    }): Promise<BranchGroup> => {
        return request('/api/groups', 'POST', data);
    },

    // Update Group
    update: async (id: string, data: {
        name?: string;
        description?: string;
        isPublic?: boolean;
        avatar?: string;
    }): Promise<BranchGroup> => {
        return request(`/api/groups/${id}`, 'PUT', data);
    },

    // Join Group
    join: async (id: string): Promise<void> => {
        return request(`/api/groups/${id}/join`, 'POST');
    },

    // Leave Group
    leave: async (id: string): Promise<void> => {
        return request(`/api/groups/${id}/leave`, 'POST');
    },

    // Follow/Unfollow Group
    follow: async (id: string) => request(`/api/groups/${id}/follow`, 'POST'),
    unfollow: async (id: string) => request(`/api/groups/${id}/follow`, 'DELETE'),

    // Activities
    getActivities: async (
        id: string,
        page = 1,
        limit = 20,
        timeRange: ActivityTimeRange = ActivityTimeRange.WEEK
    ): Promise<{ activities: GroupActivity[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(
            `/api/groups/${id}/activities?limit=${limit}&offset=${offset}&time_range=${timeRange}`
        );
    },

    // Activity Heatmap
    getHeatmap: async (id: string, timeRange: ActivityTimeRange = ActivityTimeRange.MONTH): Promise<ActivityHeatmapResponse> => {
        return request(`/api/groups/${id}/activities/heatmap?time_range=${timeRange}`);
    },

    // Stories
    getStories: async (id: string, page = 1, limit = 20): Promise<{ stories: any[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/groups/${id}/stories?limit=${limit}&offset=${offset}`);
    },

    // Members
    getMembers: async (id: string, page = 1, limit = 20): Promise<{ members: GroupMember[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/groups/${id}/members?limit=${limit}&offset=${offset}`);
    },

    // Invite Member
    inviteMember: async (id: string, username: string): Promise<void> => {
        return request(`/api/groups/${id}/members/invite`, 'POST', { username });
    },

    // Remove Member
    removeMember: async (groupId: string, userId: string): Promise<void> => {
        return request(`/api/groups/${groupId}/members/${userId}`, 'DELETE');
    },

    // Member Role
    updateMemberRole: async (groupId: string, userId: string, role: 'admin' | 'member'): Promise<void> => {
        return request(`/api/groups/${groupId}/members/${userId}/role`, 'PUT', { role });
    },

    // Invites
    getInvites: async (page = 1, limit = 20): Promise<{ invites: GroupInvite[], count: number }> => {
        const offset = (page - 1) * limit;
        return request(`/api/groups/invites?limit=${limit}&offset=${offset}`);
    },

    acceptInvite: async (inviteId: string): Promise<void> => {
        return request(`/api/groups/invites/${inviteId}/accept`, 'POST');
    },

    rejectInvite: async (inviteId: string): Promise<void> => {
        return request(`/api/groups/invites/${inviteId}/reject`, 'POST');
    },

    // Delete Group
    delete: async (id: string): Promise<void> => {
        return request(`/api/groups/${id}`, 'DELETE');
    },
};
