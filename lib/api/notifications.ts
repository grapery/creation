import { request } from './client';

export interface Notification {
    id: string;
    userId: string;
    type: 'like' | 'comment' | 'follow' | 'mention' | 'system' | 'update' | 'ai_complete' | 'story_update' | 'announcement';
    title: string;
    content?: string;
    link?: string;
    read: boolean;
    actorId?: string;
    actorName?: string;
    actorAvatar?: string;
    targetId?: string;
    targetType?: string;
    relatedStoryId?: string;
    relatedStoryCover?: string;
    relatedCharacterId?: string;
    relatedCommentId?: string;
    relatedUser?: {
        id: string;
        username: string;
        displayName: string;
        avatar?: string;
    };
    createdAt: number;
}

// Backend returns: { notifications, count }
// Note: Backend doesn't return total/unreadCount in list response
// Use getUnreadCount() to get unread count
export interface NotificationListResponse {
    notifications: Notification[];
    count: number;  // Backend returns 'count', not 'total'
}

export const notifications = {
    // List notifications
    list: async (page = 1, limit = 20): Promise<NotificationListResponse> => {
        const offset = (page - 1) * limit;
        return request(`/api/v1/notifications?limit=${limit}&offset=${offset}`);
    },

    // Get unread count
    getUnreadCount: async (): Promise<{ count: number }> => {
        return request('/api/v1/notifications/unread/count');
    },

    // Mark as read
    markAsRead: async (id: string): Promise<void> => {
        return request(`/api/v1/notifications/${id}/read`, 'POST');
    },

    // Mark all as read
    markAllAsRead: async (): Promise<void> => {
        return request('/api/v1/notifications/read-all', 'POST');
    },

    // Delete notification
    delete: async (id: string): Promise<void> => {
        return request(`/api/v1/notifications/${id}`, 'DELETE');
    },

    // Subscribe to SSE notification stream
    subscribeToSSE: (onMessage: (notification: Notification) => void, onError?: (error: Event) => void) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('voyager_auth_token') : null;
        
        if (!token) {
            console.warn('[Notifications] No token available for SSE subscription');
            return null;
        }

        // Build SSE URL with auth token
        const baseURL = process.env.NEXT_PUBLIC_API_URL || '';
        const url = `${baseURL}/api/sse/notifications?token=${encodeURIComponent(token)}`;

        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (e) {
                console.error('[Notifications] Failed to parse SSE message:', e);
            }
        };

        eventSource.onerror = (error) => {
            console.error('[Notifications] SSE error:', error);
            onError?.(error);
        };

        return eventSource;
    }
};
