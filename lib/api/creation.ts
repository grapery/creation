import { apiClient, request } from './client';

export interface GenerationRequest {
    storyId?: string; // If continuing
    prompt?: string;
    style?: string;
    characters?: string[];
    settings?: any;
}

export interface GenerationResponse {
    id: string; // Job ID or Result ID
    content?: string;
    imageUrl?: string;
    videoUrl?: string;
    status: 'pending' | 'completed' | 'failed';
}

export const creation = {
    // 1. Setup / Init Draft
    createDraft: async (data: { title: string, style?: string }): Promise<{ id: string }> => {
        return request('/api/creation/drafts', 'POST', data);
    },

    // 2. Generate Story Content (Text)
    generateContent: async (data: GenerationRequest): Promise<GenerationResponse> => {
        return request('/api/creation/generate/text', 'POST', data);
    },

    // 3. Generate Image Prompts & Images
    generateImages: async (storyboardId: string, prompts?: string[]): Promise<GenerationResponse> => {
        return request(`/api/creation/${storyboardId}/generate/images`, 'POST', { prompts });
    },

    // 4. Generate Video
    generateVideo: async (storyboardId: string, imageId: string): Promise<GenerationResponse> => {
        return request(`/api/creation/${storyboardId}/generate/video`, 'POST', { imageId });
    },

    // 5. Publish
    publish: async (storyboardId: string): Promise<void> => {
        return request(`/api/creation/${storyboardId}/publish`, 'POST');
    },

    // Polling status
    getStatus: async (jobId: string): Promise<GenerationResponse> => {
        return request(`/api/creation/jobs/${jobId}`);
    }
};
