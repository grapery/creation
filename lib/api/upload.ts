import { request } from './client';
import type { STSToken, UploadResult, ImageLevels } from '../types';

export const upload = {
    getSTSToken: async (): Promise<STSToken> =>
        request('/api/upload/sts-token'),

    uploadImage: async (file: File): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append('file', file);
        return request('/api/upload/image', 'POST', formData);
    },

    uploadAvatar: async (file: File): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append('file', file);
        return request('/api/upload/avatar', 'POST', formData);
    },

    uploadCover: async (file: File): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append('file', file);
        return request('/api/upload/cover', 'POST', formData);
    },

    uploadVideo: async (file: File): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append('file', file);
        return request('/api/upload/video', 'POST', formData);
    },

    uploadFromURL: async (url: string): Promise<UploadResult> =>
        request('/api/upload/from-url', 'POST', { url }),

    uploadMultiple: async (files: File[]): Promise<UploadResult[]> => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return request('/api/upload/multiple', 'POST', formData);
    },

    persistImageLevels: async (imageUrl: string, levels: ImageLevels): Promise<{ levels: ImageLevels }> =>
        request('/api/upload/persist-image-levels', 'POST', { imageUrl, levels }),

    getImageLevels: async (imageUrl: string): Promise<ImageLevels> =>
        request(`/api/upload/image-levels?url=${encodeURIComponent(imageUrl)}`),

    deleteFile: async (url: string): Promise<{ message: string }> =>
        request('/api/upload', 'DELETE', { url }),
};
