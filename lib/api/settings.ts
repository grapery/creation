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
    const src = raw as Record<string, unknown>;

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

const parseSettingsResponse = (data: unknown): UserSettings => {
    const obj = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
    const raw = obj.notificationSettings;
    const notificationSettings = mergeNotificationSettings(
        typeof raw === 'string'
            ? (() => {
                  try {
                      return JSON.parse(raw) as unknown;
                  } catch {
                      return {};
                  }
              })()
            : raw
    );
    return { ...(obj as Partial<UserSettings>), notificationSettings } as UserSettings;
};

export const settings = {
    get: async (): Promise<UserSettings> => {
        const data = await request('/api/v1/settings');
        return parseSettingsResponse(data);
    },

    update: async (updates: Partial<UserSettings>): Promise<UserSettings> => {
        const data = await request('/api/v1/settings', 'PUT', updates);
        return parseSettingsResponse(data);
    },

    updateLanguage: async (language: string): Promise<void> => {
        return request('/api/v1/settings/language', 'PUT', { language });
    },

    updateTheme: async (theme: 'light' | 'dark' | 'system'): Promise<void> => {
        return request('/api/v1/settings/theme', 'PUT', { theme });
    },

    updateFontSize: async (fontSize: 'small' | 'medium' | 'large'): Promise<void> => {
        return request('/api/v1/settings/font-size', 'PUT', { fontSize });
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
        return request('/api/v1/settings/privacy', 'PUT', privacy);
    },

    updateAI: async (aiEnabled: boolean, aiDataSharing: boolean): Promise<void> => {
        return request('/api/v1/settings/ai', 'PUT', { aiEnabled, aiDataSharing });
    },

    updateNotifications: async (notificationSettings: NotificationSettings): Promise<void> => {
        return request('/api/v1/settings/notifications', 'PUT', notificationSettings);
    },

    updateTeenProtection: async (teenProtectionEnabled: boolean): Promise<UserSettings> => {
        return settings.update({ teenProtectionEnabled });
    },

    getGenrePreferences: async (): Promise<{ preferredGenres: string[]; allowedGenres: string[] }> =>
        request('/api/v1/settings/preferences/genres'),

    // 后端返回 { page, items: [{ slug, titleZh, titleEn, titleJa, emoji }] }，
    // 这里映射为前端通用的 { key, label, emoji }，label 按语言选择。
    getGenreCatalog: async (): Promise<{ genres: { key: string; label: string; emoji?: string }[]; total: number }> => {
        const lang = typeof window !== 'undefined' ? (localStorage.getItem('language') || 'en') : 'en';
        const titleField = lang === 'zh-Hans' ? 'titleZh' : lang === 'ja' ? 'titleJa' : 'titleEn';
        const res = await request<{ page?: number; items?: { slug: string; titleZh?: string; titleEn?: string; titleJa?: string; emoji?: string }[] } | { genres?: { key: string; label: string }[] }>(
            '/api/v1/settings/preferences/genres/catalog'
        );
        const items = (res as { items?: { slug: string; titleZh?: string; titleEn?: string; titleJa?: string; emoji?: string }[] }).items;
        if (Array.isArray(items)) {
            return {
                genres: items.map((it) => ({
                    key: it.slug,
                    label: (it as Record<string, unknown>)[titleField] as string || it.titleEn || it.slug,
                    emoji: it.emoji,
                })),
                total: items.length,
            };
        }
        // 兼容旧结构
        const legacy = res as { genres?: { key: string; label: string }[] };
        return { genres: legacy.genres || [], total: legacy.genres?.length ?? 0 };
    },

    updateGenrePreferences: async (preferredGenres: string[]): Promise<{ message: string }> =>
        request('/api/v1/settings/preferences/genres', 'PUT', { preferredGenres }),
};
