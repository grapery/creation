import { request } from './client';
import type { StyleConfig } from '../types';

export const styles = {
    list: async (limit = 20, offset = 0): Promise<{ styles: StyleConfig[]; total: number }> =>
        request(`/api/v1/styles?limit=${limit}&offset=${offset}`),

    get: async (id: string): Promise<StyleConfig> =>
        request(`/api/v1/styles/${id}`),

    getByName: async (name: string): Promise<StyleConfig> =>
        request(`/api/v1/styles/by-name/${encodeURIComponent(name)}`),

    create: async (data: Partial<StyleConfig>): Promise<StyleConfig> =>
        request('/api/v1/styles', 'POST', data),

    update: async (id: string, data: Partial<StyleConfig>): Promise<StyleConfig> =>
        request(`/api/v1/styles/${id}`, 'PUT', data),

    delete: async (id: string): Promise<{ message: string }> =>
        request(`/api/v1/styles/${id}`, 'DELETE'),

    search: async (query: string, limit = 20, offset = 0): Promise<{ styles: StyleConfig[]; total: number }> =>
        request(`/api/v1/styles/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`),

    getOptions: async (): Promise<Record<string, string[]>> =>
        request('/api/v1/styles/options'),

    initialize: async (): Promise<{ message: string; count: number }> =>
        request('/api/v1/styles/initialize', 'POST'),
};
