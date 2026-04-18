import { request } from './client';

export interface UserSettings {
    id?: string;
    userId?: string;
    language: string;
    region?: string;
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    dataSaver: boolean;
    // Backend uses: public, followers_only, private
    profileVisibility: 'public' | 'followers_only' | 'private';
    // Backend uses: public, unlisted, private
    defaultStoryVisibility: 'public' | 'unlisted' | 'private';
    // Backend uses: public, followers_only, private
    defaultFragmentVisibility: 'public' | 'followers_only' | 'private';
    // Backend uses: everyone, followers_only, followers_of_followers, no_one
    allowFollowFrom: 'everyone' | 'followers_only' | 'followers_of_followers' | 'no_one';
    allowCommentsFrom: 'everyone' | 'followers_only' | 'no_one';
    allowMessagesFrom: 'everyone' | 'followers_only' | 'no_one';
    showOnlineStatus: boolean;
    showReadReceipts: boolean;
    aiEnabled: boolean;
    aiDataSharing: boolean;
    // Backend returns this as a JSON string, frontend should parse/stringify
    notificationSettings: NotificationSettings;
    createdAt?: number;
    updatedAt?: number;
}

export interface NotificationSettings {
    email?: boolean;
    push?: boolean;
    likes?: boolean;
    comments?: boolean;
    follows?: boolean;
    mentions?: boolean;
    updates?: boolean;
}

// Helper to parse notificationSettings from JSON string to object
const parseSettingsResponse = (data: any): UserSettings => {
    if (data.notificationSettings && typeof data.notificationSettings === 'string') {
        try {
            data.notificationSettings = JSON.parse(data.notificationSettings);
        } catch (e) {
            console.warn('[Settings] Failed to parse notificationSettings:', e);
            data.notificationSettings = {};
        }
    }
    return data;
};

export const settings = {
    // Get user settings
    // Note: Backend returns notificationSettings as JSON string, we parse it to object
    get: async (): Promise<UserSettings> => {
        const data = await request('/api/settings');
        return parseSettingsResponse(data);
    },

    // Update settings (general)
    update: async (updates: Partial<UserSettings>): Promise<UserSettings> => {
        return request('/api/settings', 'PUT', updates);
    },

    // Update language
    updateLanguage: async (language: string): Promise<void> => {
        return request('/api/settings/language', 'PUT', { language });
    },

    // Update theme
    updateTheme: async (theme: 'light' | 'dark' | 'system'): Promise<void> => {
        return request('/api/settings/theme', 'PUT', { theme });
    },

    // Update font size
    updateFontSize: async (fontSize: 'small' | 'medium' | 'large'): Promise<void> => {
        return request('/api/settings/font-size', 'PUT', { fontSize });
    },

    // Update privacy settings
    // Note: Use backend enum values:
    // - profileVisibility/defaultFragmentVisibility: 'public' | 'followers_only' | 'private'
    // - defaultStoryVisibility: 'public' | 'unlisted' | 'private'
    // - allowFollowFrom: 'everyone' | 'followers_only' | 'followers_of_followers' | 'no_one'
    // - allowCommentsFrom/allowMessagesFrom: 'everyone' | 'followers_only' | 'no_one'
    updatePrivacy: async (privacy: {
        profileVisibility?: string;
        defaultStoryVisibility?: string;
        defaultFragmentVisibility?: string;
        allowFollowFrom?: string;
        allowCommentsFrom?: string;
        allowMessagesFrom?: string;
    }): Promise<void> => {
        return request('/api/settings/privacy', 'PUT', privacy);
    },

    // Update AI settings
    updateAI: async (aiEnabled: boolean, aiDataSharing: boolean): Promise<void> => {
        return request('/api/settings/ai', 'PUT', { aiEnabled, aiDataSharing });
    },

    // Update notification settings
    updateNotifications: async (notificationSettings: UserSettings['notificationSettings']): Promise<void> => {
        return request('/api/settings/notifications', 'PUT', notificationSettings);
    },

    // ==================== Genre Preferences ====================

    getGenrePreferences: async (): Promise<{ preferredGenres: string[]; allowedGenres: string[] }> =>
        request('/api/settings/preferences/genres'),

    getGenreCatalog: async (): Promise<{ genres: { key: string; label: string }[]; total: number }> =>
        request('/api/settings/preferences/genres/catalog'),

    updateGenrePreferences: async (preferredGenres: string[]): Promise<{ message: string }> =>
        request('/api/settings/preferences/genres', 'PUT', { preferredGenres }),
};
