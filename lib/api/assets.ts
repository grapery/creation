import { request } from './client';

export interface Asset {
    id: string;
    userId: string;
    type: 'image' | 'audio' | 'video';
    name: string;
    url: string;
    thumbnail?: string;
    size: number;
    mimeType?: string;
    width?: number;
    height?: number;
    duration?: number; // in seconds for audio/video
    tags?: string[];
    usageCount: number;
    createdAt: number;
}

export const assets = {
    /** 上传单张图片（multipart），返回 OSS URL。创作参考图、封面等共用。 */
    uploadImage: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        return request('/api/upload/image', 'POST', formData);
    },

    // List assets
    list: async (params?: {
        type?: string;
        page?: number;
        limit?: number;
    }): Promise<{ assets: Asset[]; total: number }> => {
        const { type, page = 1, limit = 20 } = params || {};
        const offset = (page - 1) * limit;
        let endpoint = `/api/assets?limit=${limit}&offset=${offset}`;
        if (type) {
            endpoint += `&type=${encodeURIComponent(type)}`;
        }
        return request(endpoint);
    },

    // Get asset by ID
    get: async (id: string): Promise<Asset> => {
        return request(`/api/assets/${id}`);
    },

    // Create asset
    create: async (data: {
        type: string;
        name: string;
        url: string;
        thumbnail?: string;
        size: number;
        mimeType?: string;
        width?: number;
        height?: number;
        duration?: number;
        tags?: string[];
    }): Promise<Asset> => {
        return request('/api/assets', 'POST', data);
    },

    // Update asset
    update: async (id: string, data: Partial<{
        name: string;
        tags: string[];
    }>): Promise<Asset> => {
        return request(`/api/assets/${id}`, 'PUT', data);
    },

    // Delete asset
    delete: async (id: string): Promise<void> => {
        return request(`/api/assets/${id}`, 'DELETE');
    }
};
