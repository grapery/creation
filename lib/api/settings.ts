import { request } from './client';

export interface PushNotificationSettings {
    enabled: boolean;
    newFollower: boolean;
    newLike: boolean;
    newComment: boolean;
    storyUpdate: boolean;
    directMessage: boolean;
    systemAnnouncement: boolean;
    marketing: boolean;
}

export interface EmailNotificationSettings {
    enabled: boolean;
    weeklyDigest: boolean;
    securityAlert: boolean;
    marketing: boolean;
    productUpdates: boolean;
}

export interface InAppNotificationSettings {
    enabled: boolean;
    showPreview: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
}

export interface NotificationSettings {
    push: PushNotificationSettings;
    email: EmailNotificationSettings;
    inApp: InAppNotificationSettings;
}

export const defaultNotificationSettings = (): NotificationSettings => ({
    push: {
        enabled: true,
        newFollower: true,
        newLike: true,
        newComment: true,
        storyUpdate: true,
        directMessage: true,
        systemAnnouncement: true,
        marketing: false,
    },
    email: {
        enabled: true,
        weeklyDigest: true,
        securityAlert: true,
        marketing: false,
        productUpdates: true,
    },
    inApp: {
        enabled: true,
        showPreview: true,
        soundEnabled: true,
        vibrationEnabled: true,
    },
});

export interface UserSettings {
    id?: string;
    userId?: string;
    language: string;
    region?: string;
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    dataSaver: boolean;
    profileVisibility: 'public' | 'followers_only' | 'private';
    defaultStoryVisibility: 'public' | 'unlisted' | 'private';
    defaultFragmentVisibility: 'public' | 'followers_only' | 'private';
    allowFollowFrom: 'everyone' | 'followers_only' | 'followers_of_followers' | 'no_one';
    allowCommentsFrom: 'everyone' | 'followers_only' | 'no_one';
    allowMessagesFrom: 'everyone' | 'followers_only' | 'no_one';
    showOnlineStatus: boolean;
    showReadReceipts: boolean;
    showPublicStories?: boolean;
    showPublicFragments?: boolean;
    showPublicBookmarks?: boolean;
    aiEnabled: boolean;
    aiDataSharing: boolean;
    notificationSettings: NotificationSettings;
    preferredGenres?: string[];
    teenProtectionEnabled?: boolean;
    createdAt?: number;
    updatedAt?: number;
}

function mergeNotificationSettings(raw: unknown): NotificationSettings {
    const defaults = defaultNotificationSettings();
    if (!raw || typeof raw !== 'object') return defaults;
    const src = raw as Record<string, any>;

    // Legacy flat shape → nested
    if (typeof src.push === 'boolean' || typeof src.email === 'boolean' || typeof src.likes === 'boolean') {
        return {
            push: {
                ...defaults.push,
                enabled: src.push !== false,
                newLike: src.likes !== false,
                newComment: src.comments !== false,
                newFollower: src.follows !== false,
                storyUpdate: src.updates !== false,
            },
            email: {
                ...defaults.email,
                enabled: src.email !== false,
            },
            inApp: { ...defaults.inApp },
        };
    }

    return {
        push: { ...defaults.push, ...(src.push || {}) },
        email: { ...defaults.email, ...(src.email || {}) },
        inApp: { ...defaults.inApp, ...(src.inApp || {}) },
    };
}

const parseSettingsResponse = (data: any): UserSettings => {
    const notificationSettings = mergeNotificationSettings(
        typeof data.notificationSettings === 'string'
            ? (() => {
                  try {
                      return JSON.parse(data.notificationSettings);
                  } catch {
                      return {};
                  }
              })()
            : data.notificationSettings
    );
    return { ...data, notificationSettings };
};

export const settings = {
    get: async (): Promise<UserSettings> => {
        const data = await request('/api/settings');
        return parseSettingsResponse(data);
    },

    update: async (updates: Partial<UserSettings>): Promise<UserSettings> => {
        const data = await request('/api/settings', 'PUT', updates);
        return parseSettingsResponse(data);
    },

    updateLanguage: async (language: string): Promise<void> => {
        return request('/api/settings/language', 'PUT', { language });
    },

    updateTheme: async (theme: 'light' | 'dark' | 'system'): Promise<void> => {
        return request('/api/settings/theme', 'PUT', { theme });
    },

    updateFontSize: async (fontSize: 'small' | 'medium' | 'large'): Promise<void> => {
        return request('/api/settings/font-size', 'PUT', { fontSize });
    },

    updatePrivacy: async (privacy: {
        profileVisibility?: string;
        defaultStoryVisibility?: string;
        defaultFragmentVisibility?: string;
        allowFollowFrom?: string;
        allowCommentsFrom?: string;
        allowMessagesFrom?: string;
        showOnlineStatus?: boolean;
        showReadReceipts?: boolean;
        showPublicStories?: boolean;
        showPublicFragments?: boolean;
        showPublicBookmarks?: boolean;
    }): Promise<void> => {
        return request('/api/settings/privacy', 'PUT', privacy);
    },

    updateAI: async (aiEnabled: boolean, aiDataSharing: boolean): Promise<void> => {
        return request('/api/settings/ai', 'PUT', { aiEnabled, aiDataSharing });
    },

    updateNotifications: async (notificationSettings: NotificationSettings): Promise<void> => {
        return request('/api/settings/notifications', 'PUT', notificationSettings);
    },

    updateTeenProtection: async (teenProtectionEnabled: boolean): Promise<UserSettings> => {
        return settings.update({ teenProtectionEnabled });
    },

    getGenrePreferences: async (): Promise<{ preferredGenres: string[]; allowedGenres: string[] }> =>
        request('/api/settings/preferences/genres'),

    getGenreCatalog: async (): Promise<{ genres: { key: string; label: string }[]; total: number }> =>
        request('/api/settings/preferences/genres/catalog'),

    updateGenrePreferences: async (preferredGenres: string[]): Promise<{ message: string }> =>
        request('/api/settings/preferences/genres', 'PUT', { preferredGenres }),
};
