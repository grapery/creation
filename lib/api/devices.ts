import { request } from './client';

export interface DeviceInfo {
    token: string;
    platform: 'ios' | 'android' | 'web';
    model?: string;
    osVersion?: string;
    appVersion?: string;
}

export const devices = {
    // Register device for push notifications
    register: async (deviceInfo: DeviceInfo): Promise<void> => {
        return request('/api/v1/devices/register', 'POST', deviceInfo);
    },

    // Unregister device
    unregister: async (token: string): Promise<void> => {
        return request('/api/v1/devices/unregister', 'POST', { token });
    },

    // Update badge count
    updateBadge: async (count: number): Promise<void> => {
        return request('/api/v1/devices/badge', 'POST', { count });
    },

    // Test push notification (for development)
    testPush: async (): Promise<{ success: boolean; message?: string }> => {
        return request('/api/v1/devices/test-push', 'POST');
    }
};
